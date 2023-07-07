class Run < ApplicationRecord
    belongs_to :user
    validates :run_date, :city, :state, :country, :number_marathon, presence: true
end
