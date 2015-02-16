class SimulationsController < ApplicationController
  
  def index

  end
  
  def get_load_data
    
    @load_data = LoadData.all
    
       respond_to do |format|
      format.json {
        render :json => {
          :load_data => @load_data
          }
      }
    end
  end
  
  def call_matlab
    
    host = 'localhost'
    @client = Carrot.new(
    :host   => host
    )
    
    input_queue = @client.queue('input_queue')
    input_queue.publish("2,2")
    
    output_queue = @client.queue('output_queue')
    
    result=""
    
    while true
      while msg = output_queue.pop(:ack => true)
        result = msg
        puts "Result got: #{msg}"
        output_queue.ack
      end
      
      if(result!="")
        break
      end
      
    end
    @array_returned = JSON.parse(result)
    @array_actual =  LoadData.where("hour > ? and hour <= ?", 24*45,24*(45+1))
    respond_to do |format|
      format.json {
        render :json => {
          :array_predicted => @array_returned, 
          :array_actual => @array_actual
          }
      }
    end
    
  end
end
