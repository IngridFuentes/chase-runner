require 'byebug'

class Api::V1::SessionsController < ApplicationController
  
    def create
    #  byebug
      # user_params = params.require(:session).permit(:username, :email)
      # user = User.find_or_create_by(user_params)

      user = User.find_or_create_by(username: params[:session][:username], email: params[:session][:email])
      # if user && user.authenticate(params[:session][:email])
      if user
        session[:user_id] = user.id
        render json: user
      else
        render json: {
                 error: "Invalid credentials",
               }
      end
# byebug
      # user = User.find_by(username: params[:username], email: params[:email])
      # if user
      #   session[:user_id] = user.id
      #   session[:username] = user.username
      #   session[:email] = user.email
      # else
      #     render json: {
      #              error: "Invalid credentials",
      #           }
      # end

  #     byebug
  #     user_params = params.require(:session).permit(:username, :email)

  # user = User.find_or_initialize_by(user_params)

  # if user.save
  #   session[:user_id] = user.id
  #   render json: user
  # else
  #   render json: { error: user.errors.full_messages }, status: :unprocessable_entity
  # end

  end
  
    def get_current_user
      if logged_in?
        render json: current_user
      else
        render json: {
                 error: "No one logged in",
               }
      end
    end
  
    def destroy
      session.clear
      render json: {
        notice: "Succesfully logged out",
      }
    end
  end
  