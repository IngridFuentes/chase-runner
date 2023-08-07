class UserSerializer < ActiveModel::Serializer
  # include JSONAPI::Serializer
  attributes :id, :email, :created_at
end
