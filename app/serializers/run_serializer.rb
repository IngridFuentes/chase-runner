class RunSerializer < ActiveModel::Serializer
    attributes :id, :run_date, :city, :state, :country, :number_marathon, :notes
    belongs_to :user
  end