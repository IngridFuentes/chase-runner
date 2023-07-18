class Api::V1::UsersController < ApplicationController
  def index
    users = User.all
    render json: users, status: 200
  end

  private

  def user_params
    params.require(:user).permit(:id, :username, :email)
  end

  # def user_params
  #   params.require(:session).permit(:username, :email)
  # end
end
