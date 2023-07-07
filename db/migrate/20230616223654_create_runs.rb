class CreateRuns < ActiveRecord::Migration[7.0]
  def change
    create_table :runs do |t|
      t.date :run_date
      t.string :city
      t.string :state
      t.string :country
      t.integer :number_marathon
      t.text :notes

      t.timestamps
    end
  end
end
