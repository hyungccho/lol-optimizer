require 'csv'

module Admin
  module Slates
    class Import
      attr_reader :csv_url, :name, :start_time, :user_id

      def initialize(opts)
        @csv_url = opts[:csv_url]
        @name = opts[:name]
        @start_time = DateTime.parse(opts[:start_time])
        @user_id = opts[:user_id]
      end

      def perform
        Slate.transaction do
          # Destroy existing slate for this time if one already exists. FE
          # should have warned admin user.
          _destroy_existing_slate!

          # Create new slate for this time
          _create_slate!

          rows.each do |row|
            case row['Position']
            when 'TEAM'
              _create_slates_team!(row)
            else
              _create_players_slate!(row)
            end
          end
        end

        Admin::Slates::CreatePredictionsWorker.perform_async(@slate.id, user_id)
        ::Slates::ShowSerializer.new(@slate).serializable_hash
      rescue => e
        Rails.logger.fatal "Error occurred while uploading slate: #{e.message}"
        false
      end

      private

      def csv_data
        @csv_data ||= open(csv_url).read.force_encoding('utf-8')
      rescue
        nil
      end

      def rows
        @rows ||= CSV.parse(csv_data, headers: true).map do |row|
          row.to_hash
        end
      end

      def _create_slate!
        @slate = Slate.create!(
          name: name,
          start_time: start_time
        )
      end

      def _create_slates_team!(row)
        team = Team.where(
          "lower(replace(short_name, ' ', '')) = ?",
          row['teamAbbrev'].gsub(' ', '').downcase
        ).first

        raise "Team with name: #{row['Name']} not found! Aborting.." unless team
        SlatesTeam.create!(
          slate_id: @slate.id,
          team_id: team.id,
          game_info: row['GameInfo'],
          salary: row['Salary'].to_i,
          team_abbrev: row['teamAbbrev']
        )
      end

      def _create_players_slate!(row)
        player = Player.where(
          "lower(replace(name, ' ', '')) = ?",
          row['Name'].gsub(' ', '').downcase
        ).first

        raise "Player with name: #{row['Name']} not found! Aborting.." unless player
        # Update position of the player in case it's changed since the last
        # slate.
        player.position = row['Position']
        player.save!

        PlayersSlate.create!(
          slate_id: @slate.id,
          player_id: player.id,
          game_info: row['GameInfo'],
          salary: row['Salary'].to_i,
          team_abbrev: row['teamAbbrev']
        )
      end

      def _destroy_existing_slate!
        Slate.find_by(start_time: start_time).try(:destroy)
      end
    end
  end
end
