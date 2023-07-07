class User < ApplicationRecord
    has_many :runs
    validates :email, uniqueness: :true
    validates :username, presence: :true
end
