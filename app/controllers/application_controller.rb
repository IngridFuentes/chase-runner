      
class ApplicationController < ActionController::API 
    include ::ActionController::Cookies
    before_action:authenticate_user!
    
    def current_user
        User.find_by(id: session[:user_id])
    end

    def logged_in?
        !!current_user
    end

    def test_session
        session[:test] = 'Hello, world!'
        render plain: 'Session value set!'
      end
end
