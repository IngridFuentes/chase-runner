class Api::V1::RunsController < ApplicationController
    before_action :set_job_application, only: [:edit, :show, :destroy]

    def index
        if logged_in?
          runs = current_user.runs
          render json: runs, status: 200
        else
          render json: [{
            error: "You must be logged in to see your marathons",
          }]
        end
      end

      def show
        render json: runs, status: 200
      end
    
      def new
      end

      def edit
        render json: runs, status: 200
      end

      def create
        # byebug
        if logged_in?
          runs = current_user.runs.create(runs_params)
          render json: runs, status: 200
        else
          render json: { error: "Failed to create an Application", status: 500 }, status: 500
        end
      end

      def update
        if params[:id] != "undefined"
          runs = Runs.find(params[:id])
          runs.update(runs_params)
          render json: runs, status: 200
        end
      end

      def destroy
        @runs.destroy
        render json: { data: "Run info destroyed" }
      end
    
      private
    
      def set_run
        @run = Run.find(params[:id])
      end
    
      def run_params
        params.require(:run).permit(:id, :user_id, :run_date, :city, :state, :country, :number_marathon, :notes)
      end
end
