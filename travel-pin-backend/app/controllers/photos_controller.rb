class PhotosController < ApplicationController
  before_action :find_photo, only: [:show, :delete]

  def index
    photos = Photo.all
    render json: photos
  end

  def new
    photo = Photo.new
  end

  def create
    puts photo_params
    photo = Photo.new(photo_params)
    if photo.save
      render json: photo
    else
      puts "Not Created!!"
    end
  end

  def delete
    photo.destroy
  end

  private

  def find_photo
    photo = Photo.find(params[:id])
    render json: photo
  end

  def photo_params
    params.require(:photo).permit(:board_id, :url)
  end
end
