class AddUserIdToRuns < ActiveRecord::Migration[7.0]
  def change
    add_column :runs, :user_id, :integer
  end
end
