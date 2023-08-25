      
class ApplicationController < ActionController::API 
#     include ::ActionController::Cookies
#     before_action:authenticate_user!

respond_to :json
before_action :process_token

private

def process_token
  if request.headers['Authorization'].present?
    begin
      jwt_payload = JWT.decode(request.headers['Authorization'].split(' ')[1], Rails.application.secrets.secret_key_base).first
      @current_user_id = jwt_payload['id']
    rescue JWT::ExpiredSignature, JWT::VerificationError, JWT::DecodeError
      head :unauthorized
    end
  end
end

def authenticate_user!(options = {})
  head :unauthorized unless signed_in?
end

def current_user
  @current_user ||= super || User.find(@current_user_id)
end

def signed_in?
  @current_user_id.present?
end
# before_action :configure_permitted_parameters, if: :devise_controller?
#   protected
#   def configure_permitted_parameters
#     added_attrs = [:first_name, :last_name, :email, :encrypted_password, :password_confirmation, :remember_me]
#     devise_parameter_sanitizer.permit(:sign_up, keys: added_attrs)
#     devise_parameter_sanitizer.permit(:account_update, keys: added_attrs)
#     devise_parameter_sanitizer.permit(:sign_in, keys: added_attrs)
#   end

#     def current_user
#         User.find_by(id: session[:user_id])
#     end

#     def logged_in?
#         !!current_user
#     end

# end
# class ApplicationController < ActionController::Base
  # protect_from_forgery with: :null_session
  # protect_from_forgery prepend: true
  # before_action:authenticate_user!
  # skip_before_action :verify_authenticity_token, :only => :create

  # before_action :configure_permitted_parameters, if: :devise_controller?

  # def user_signed_in?
  #   user_signed_in?
  # end
  # def current_user
  #   current_user
  # end


  # protected

    # Restrict parameters for sign up input.
    # def configure_permitted_parameters
    #     added_attrs = [:first_name, :last_name, :email, :encrypted_password, :password_confirmation, :remember_me]
    #     devise_parameter_sanitizer.permit(:sign_up, keys: added_attrs)
    #     devise_parameter_sanitizer.permit(:account_update, keys: added_attrs)
    #     devise_parameter_sanitizer.permit(:sign_in, keys: added_attrs)
    # end

  # include ActionController::Cookies
  # after_action :set_csrf_cookie

  # protect_from_forgery prepend: true
  # protect_from_forgery with: :exception
  # protect_from_forgery unless: -> { request.format.json? }

  # private

  # def set_csrf_cookie
  #   cookies["CSRF-TOKEN"] = {
  #     value: form_authenticity_token,
  #     secure: true,
  #   }
  # end
  
end