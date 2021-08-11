from flask import render_template, redirect, flash, request
from app import app 

@app.route('/')
def index():
    return render_template('index.html', title='Главная')

@app.route('/about_us')
def aboutUs():
    return render_template('about-us.html', title='О нас')


@app.errorhandler(400)
def bad_request_error(error):
    flash('Кажется, что-то пошло не так..')
    return redirect('/')

@app.errorhandler(401)
def unauthorized_error(error):
    return render_template('error-401.html'), 401

@app.errorhandler(403)
def forbidden_error(error):
    return render_template('error-403.html'), 403

@app.errorhandler(404)
def not_found_error(error):
    return render_template('error-404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    # db.session.rollback()
    return render_template('error-500.html'), 500