class CsrfTokensController < ApplicationController
    def index
      render json: { csrfToken: form_authenticity_token }
    end
  end