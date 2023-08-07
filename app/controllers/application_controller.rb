      
# class ApplicationController < ActionController::API 
#     include ::ActionController::Cookies
#     before_action:authenticate_user!

#     def current_user
#         User.find_by(id: session[:user_id])
#     end

#     def logged_in?
#         !!current_user
#     end

# end
class ApplicationController < ActionController::Base
    protect_from_forgery with: :exception
  
  end