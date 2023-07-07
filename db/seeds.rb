# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

User.destroy_all
require "date"
user = User.create(username: "Sonia", email: "sonia@email.com")

run = user.runs.create(run_date: Date.new(2023, 4, 15), city: "New York", state: "New York", country: "USA", number_marathon: "4", notes: "Done in 4h 15min")
