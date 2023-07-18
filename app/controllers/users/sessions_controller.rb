# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # before_action :configure_sign_in_params, only: [:create]

  # GET /resource/sign_in
  # def new
  #   super
  # end

  # POST /resource/sign_in
  def create
     super
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

  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end
  def destroy
    session.clear
    render json: {
      notice: "Succesfully logged out",
    }
  end
  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end

  private

  def respond_with(resource, _opts={})
    render json: {
      status: {code: 200, message: 'Logged in successfully.'},
      data: UserSerializer.new(resource).serializable_hash[:data][:attributes]
    }, status: :ok
  end
  def respond_to_on_destroy
    if current_user
      render json: {
        status: 200,
        message: 'Logged out successfully'
      }, status: :ok
      else
        render json: {
          status: 401,
          message: 'Could not find an active session.'
        }, status: unauthorized
  end
end
