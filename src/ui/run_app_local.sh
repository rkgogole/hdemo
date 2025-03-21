echo "Starting backend server..."
cd backend
./launch_local_server.sh &
cd ..
echo "Starting frontend server..."
cd app
./launch_local_server.sh &
echo "All servers started"
echo "You can now access the app at http://localhost:3000"

