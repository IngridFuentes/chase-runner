class Api::V1::SessionsController < ApplicationController
    def create
      # byebug
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
  