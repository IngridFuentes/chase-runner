# frozen_string_literal: true

class Users::SessionsController < Devise::SessionsController
  # include RackSessionsFix
  # respond_to :json

  def create
    user = User.find_by_email(sign_in_params[:email])

    if user && user.valid_password?(sign_in_params[:password])
      token = user.generate_jwt
      render json: token.to_json
    else
      render json: { errors: { 'email or password' => ['is invalid'] } }, status: :unprocessable_entity
    end
  end

  # before_action :configure_sign_in_params, only: [:create]
  # skip_before_action :verify_authenticity_token
  # include Devise::Controllers::Helpers
  # GET /resource/sign_in
  # private
  # def respond_with(current_user, _opts = {})
  #   render json: {
  #     status: { 
  #       code: 200, message: 'Logged in successfully.',
  #       data: { user: UserSerializer.new(current_user).serializable_hash[:data][:attributes] }
  #     }
  #   }, status: :ok
  # end

  # def respond_to_on_destroy
  #   if request.headers['Authorization'].present?
  #     jwt_payload = JWT.decode(request.headers['Authorization'].split(' ').last, Rails.application.credentials.devise_jwt_secret_key!).first
  #     current_user = User.find(jwt_payload['sub'])
  #   end
  #   if current_user
  #     render json: {
  #       status: 200,
  #       message: 'Logged out successfully.'
  #     }, status: :ok
  #   else
  #     render json: {
  #       status: 401,
  #       message: "Couldn't find an active session."
  #     }, status: :unauthorized
  #   end
  # end

  # POST /resource/sign_in
  # def create
    # super
    # user = User.authenticate(params[:email], params[:password])
    # if user
    #   session[:user_id] = user.id
    #   redirect_to root_url, :notice => "Logged in!"
    # else
    #   flash.now.alert = "Invalid email or password"
    #   render "new"
    # end
  #   @user = User.authenticate(user_params)
  # if @user.save
  #   session[:user_id] = user.id
  #   flash[:success] = "New User created."
  #   redirect_to '/layouts/application'
  # else
  #   render 'new'
  # end
  # end

  # def get_current_user
    # if logged_in?
    #   render json: current_user
    # else
    #   render json: {
    #            error: "No one logged in",
    #          }
    # end
  # end
  # DELETE /resource/sign_out
  # def destroy
  #   super
  # end
  # def destroy
    # session.clear
    # render json: {
    #   notice: "Succesfully logged out",
    # }
    # session[:user_id] = nil
    # redirect_to root_url, :notice => "Logged out!"
  # end
  # protected

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_sign_in_params
  #   devise_parameter_sanitizer.permit(:sign_in, keys: [:attribute])
  # end

  # private

  # def user_params
    #  params.require(:user).permit(:email, :password)
  # end

end
