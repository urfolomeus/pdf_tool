from src import create_app

# Call the application factory function to construct a Flask application
# instance using the development configuration
app = create_app()


if __name__ == "__main__":
    app.run(port=5001, debug=True)
