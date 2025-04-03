from flask import Flask, render_template, redirect, url_for, flash, request, session

from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.config['SECRET_KEY'] = '23600199bb32208023e04ddf1d282210'

# Simple in-memory data structures
users = {}
products2 = {}

class User:
    def __init__(self, username, password):
        self.id = len(users) + 1
        self.username = username
        self.password = generate_password_hash(password)
        self.products = []

class Product:
    def __init__(self, name, description, owner, image):
        self.id = len(products2) + 1
        self.name = name
        self.description = description
        self.owner = owner
        self.image = image


@app.route('/')
def home():
    print(session)
    if 'user_id' in session:
        user_id = session['user_id']
        user = users.get(user_id)
        print(f'user_id: {user_id}, user: {user}')  # Debugging print statement
        user_products = user.products if user else []
        flash_messages = [message for message in get_flashed_messages(with_categories=True)]
        return render_template('index.html', user=user, products2=products2, flash_messages=flash_messages)
    else:
        return 'Welcome! <a href="/login">Login</a>'
@app.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        if username in users:
            flash('Username already exists. Please choose a different one.', 'danger')
        else:
            user = User(username, password)
            users[user.id] = user
            session['user_id'] = user.id
            flash('Signup successful! You can now add products.', 'success')
            return redirect(url_for('home'))

    return render_template('signup.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = next((user for user in users.values() if user.username == username), None)
        if user and check_password_hash(user.password, password):
            session['user_id'] = user.id
            flash('Login successful!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Invalid username or password', 'danger')

    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    flash('Logout successful!', 'success')
    return redirect(url_for('home'))
@app.route('/add_product', methods=['GET', 'POST'])
def add_product():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        name = request.form.get('product2_name')
        description = request.form.get('product2_description')

        user_id = session['user_id']
        user = users.get(user_id)

        if user:
            product = Product(name, description, user, "#")  # Replace "#" with the actual image path for the product
            products2[product.id] = product

            # Now that the product is created, generate the link for the product detail page
            link = url_for('product_detail', username=user.username, product_id=product.id)
            product.link = link  # Update the product with the generated link

            flash(f'Product added successfully! Link: {link}', 'success')
            return redirect(url_for('home'))
        else:
            flash('User not found', 'danger')

    return render_template('add_product.html')
@app.route('/product/<username>/<int:product_id>')
def product_detail(username, product_id):
    user = next((user for user in users.values() if user.username == username), None)
    if user:
        product = next((product for product in products2.values() if product.id == product_id), None)
        if product:
            return render_template('product_detail.html', user=user, product2=product)
        else:
            flash('Product not found', 'danger')
    else:
        flash('User not found', 'danger')

    return redirect(url_for('home'))
if __name__ == '__main__':
    app.run(debug=True)
