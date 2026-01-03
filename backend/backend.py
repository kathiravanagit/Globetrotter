# models.py
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, date
import uuid

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(100))
    profile_photo = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    trips = db.relationship('Trip', backref='user', lazy=True, cascade='all, delete-orphan')
    preferences = db.relationship('UserPreferences', backref='user', uselist=False, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'profile_photo': self.profile_photo,
            'created_at': self.created_at.isoformat()
        }

class Trip(db.Model):
    __tablename__ = 'trips'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    cover_photo = db.Column(db.String(500))
    is_public = db.Column(db.Boolean, default=False)
    total_budget = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    stops = db.relationship('TripStop', backref='trip', lazy=True, cascade='all, delete-orphan')
    shared_links = db.relationship('SharedTrip', backref='trip', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'start_date': self.start_date.isoformat(),
            'end_date': self.end_date.isoformat(),
            'cover_photo': self.cover_photo,
            'is_public': self.is_public,
            'total_budget': self.total_budget,
            'stop_count': len(self.stops)
        }
    
    def calculate_budget(self):
        """Calculate total budget from all stops"""
        total = 0
        for stop in self.stops:
            total += (stop.accommodation_budget or 0) + (stop.transport_budget or 0)
            for activity in stop.activities:
                total += (activity.actual_cost or 0)
        self.total_budget = total
        return total

class City(db.Model):
    __tablename__ = 'cities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    country_code = db.Column(db.String(10))
    cost_index = db.Column(db.Float)
    popularity = db.Column(db.Integer, default=0)
    description = db.Column(db.Text)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    
    # Relationships
    activities = db.relationship('Activity', backref='city', lazy=True)
    trip_stops = db.relationship('TripStop', backref='city', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'country': self.country,
            'country_code': self.country_code,
            'cost_index': self.cost_index,
            'popularity': self.popularity,
            'description': self.description,
            'latitude': self.latitude,
            'longitude': self.longitude
        }

class TripStop(db.Model):
    __tablename__ = 'trip_stops'
    
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)
    arrival_date = db.Column(db.Date, nullable=False)
    departure_date = db.Column(db.Date, nullable=False)
    order_index = db.Column(db.Integer, nullable=False)
    notes = db.Column(db.Text)
    accommodation_budget = db.Column(db.Float, default=0.0)
    transport_budget = db.Column(db.Float, default=0.0)
    
    # Relationships
    activities = db.relationship('TripActivity', backref='trip_stop', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'city': self.city.to_dict() if self.city else None,
            'arrival_date': self.arrival_date.isoformat(),
            'departure_date': self.departure_date.isoformat(),
            'order_index': self.order_index,
            'notes': self.notes,
            'accommodation_budget': self.accommodation_budget,
            'transport_budget': self.transport_budget,
            'activities': [activity.to_dict() for activity in self.activities]
        }

class Activity(db.Model):
    __tablename__ = 'activities'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    category = db.Column(db.String(50), nullable=False)
    avg_cost = db.Column(db.Float)
    duration_hours = db.Column(db.Float)
    city_id = db.Column(db.Integer, db.ForeignKey('cities.id'), nullable=False)
    latitude = db.Column(db.Float)
    longitude = db.Column(db.Float)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'avg_cost': self.avg_cost,
            'duration_hours': self.duration_hours,
            'city_id': self.city_id
        }

class TripActivity(db.Model):
    __tablename__ = 'trip_activities'
    
    id = db.Column(db.Integer, primary_key=True)
    trip_stop_id = db.Column(db.Integer, db.ForeignKey('trip_stops.id'), nullable=False)
    activity_id = db.Column(db.Integer, db.ForeignKey('activities.id'), nullable=False)
    scheduled_date = db.Column(db.Date, nullable=False)
    start_time = db.Column(db.Time)
    end_time = db.Column(db.Time)
    actual_cost = db.Column(db.Float)
    notes = db.Column(db.Text)
    
    # Relationship
    activity = db.relationship('Activity', backref='trip_activities')
    
    def to_dict(self):
        return {
            'id': self.id,
            'activity': self.activity.to_dict() if self.activity else None,
            'scheduled_date': self.scheduled_date.isoformat(),
            'start_time': str(self.start_time) if self.start_time else None,
            'end_time': str(self.end_time) if self.end_time else None,
            'actual_cost': self.actual_cost,
            'notes': self.notes
        }

class SharedTrip(db.Model):
    __tablename__ = 'shared_trips'
    
    id = db.Column(db.Integer, primary_key=True)
    trip_id = db.Column(db.Integer, db.ForeignKey('trips.id'), nullable=False)
    share_code = db.Column(db.String(50), unique=True, nullable=False, default=lambda: str(uuid.uuid4()))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expiry_date = db.Column(db.Date)
    
    def to_dict(self):
        return {
            'share_code': self.share_code,
            'created_at': self.created_at.isoformat(),
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None
        }

class UserPreferences(db.Model):
    __tablename__ = 'user_preferences'
    
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    language = db.Column(db.String(10), default='en')
    currency = db.Column(db.String(10), default='USD')
    notifications_enabled = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'language': self.language,
            'currency': self.currency,
            'notifications_enabled': self.notifications_enabled
        }

# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import os
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key')
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY', 'jwt-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=7)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///globetrotter.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
db.init_app(app)
jwt = JWTManager(app)

# Create tables
with app.app_context():
    db.create_all()

# ========== AUTHENTICATION ROUTES ==========
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 400
    
    user = User(
        email=data['email'],
        name=data.get('name')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Create default preferences
    preferences = UserPreferences(user_id=user.id)
    db.session.add(preferences)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing email or password'}), 400
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'token': access_token,
        'user': user.to_dict()
    })

# ========== TRIP MANAGEMENT ROUTES ==========
@app.route('/api/trips', methods=['GET'])
@jwt_required()
def get_trips():
    user_id = get_jwt_identity()
    trips = Trip.query.filter_by(user_id=user_id).all()
    
    return jsonify([trip.to_dict() for trip in trips])

@app.route('/api/trips', methods=['POST'])
@jwt_required()
def create_trip():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    required_fields = ['name', 'start_date', 'end_date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    try:
        trip = Trip(
            user_id=user_id,
            name=data['name'],
            description=data.get('description'),
            start_date=datetime.fromisoformat(data['start_date']).date(),
            end_date=datetime.fromisoformat(data['end_date']).date(),
            cover_photo=data.get('cover_photo'),
            is_public=data.get('is_public', False)
        )
        
        db.session.add(trip)
        db.session.commit()
        
        return jsonify(trip.to_dict()), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/api/trips/<int:trip_id>', methods=['GET'])
@jwt_required()
def get_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first_or_404()
    
    trip_data = trip.to_dict()
    trip_data['stops'] = [stop.to_dict() for stop in trip.stops]
    
    return jsonify(trip_data)

@app.route('/api/trips/<int:trip_id>', methods=['PUT'])
@jwt_required()
def update_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first_or_404()
    
    data = request.get_json()
    
    if 'name' in data:
        trip.name = data['name']
    if 'description' in data:
        trip.description = data['description']
    if 'start_date' in data:
        trip.start_date = datetime.fromisoformat(data['start_date']).date()
    if 'end_date' in data:
        trip.end_date = datetime.fromisoformat(data['end_date']).date()
    if 'cover_photo' in data:
        trip.cover_photo = data['cover_photo']
    if 'is_public' in data:
        trip.is_public = data['is_public']
    
    db.session.commit()
    
    return jsonify(trip.to_dict())

@app.route('/api/trips/<int:trip_id>', methods=['DELETE'])
@jwt_required()
def delete_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first_or_404()
    
    db.session.delete(trip)
    db.session.commit()
    
    return jsonify({'message': 'Trip deleted successfully'})

# ========== ITINERARY BUILDER ROUTES ==========
@app.route('/api/trips/<int:trip_id>/stops', methods=['POST'])
@jwt_required()
def add_stop(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first_or_404()
    
    data = request.get_json()
    
    required_fields = ['city_id', 'arrival_date', 'departure_date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Calculate order index
    order_index = len(trip.stops) + 1
    
    stop = TripStop(
        trip_id=trip_id,
        city_id=data['city_id'],
        arrival_date=datetime.fromisoformat(data['arrival_date']).date(),
        departure_date=datetime.fromisoformat(data['departure_date']).date(),
        order_index=order_index,
        notes=data.get('notes'),
        accommodation_budget=data.get('accommodation_budget', 0),
        transport_budget=data.get('transport_budget', 0)
    )
    
    db.session.add(stop)
    
    # Update trip budget
    trip.calculate_budget()
    db.session.commit()
    
    return jsonify(stop.to_dict()), 201

@app.route('/api/trips/<int:trip_id>/stops/<int:stop_id>/activities', methods=['POST'])
@jwt_required()
def add_activity_to_stop(trip_id, stop_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first_or_404()
    stop = TripStop.query.filter_by(id=stop_id, trip_id=trip_id).first_or_404()
    
    data = request.get_json()
    
    required_fields = ['activity_id', 'scheduled_date']
    if not all(field in data for field in required_fields):
        return jsonify({'error': 'Missing required fields'}), 400
    
    activity = TripActivity(
        trip_stop_id=stop_id,
        activity_id=data['activity_id'],
        scheduled_date=datetime.fromisoformat(data['scheduled_date']).date(),
        start_time=datetime.strptime(data['start_time'], '%H:%M').time() if data.get('start_time') else None,
        end_time=datetime.strptime(data['end_time'], '%H:%M').time() if data.get('end_time') else None,
        actual_cost=data.get('actual_cost'),
        notes=data.get('notes')
    )
    
    db.session.add(activity)
    
    # Update trip budget
    trip.calculate_budget()
    db.session.commit()
    
    return jsonify(activity.to_dict()), 201

# ========== CITY & ACTIVITY SEARCH ROUTES ==========
@app.route('/api/cities/search', methods=['GET'])
def search_cities():
    query = request.args.get('q', '')
    country = request.args.get('country')
    
    cities_query = City.query
    
    if query:
        cities_query = cities_query.filter(
            (City.name.ilike(f'%{query}%')) | 
            (City.country.ilike(f'%{query}%'))
        )
    
    if country:
        cities_query = cities_query.filter_by(country=country)
    
    cities = cities_query.limit(20).all()
    
    return jsonify([city.to_dict() for city in cities])

@app.route('/api/activities/search', methods=['GET'])
def search_activities():
    city_id = request.args.get('city_id')
    category = request.args.get('category')
    max_cost = request.args.get('max_cost')
    
    activities_query = Activity.query
    
    if city_id:
        activities_query = activities_query.filter_by(city_id=city_id)
    
    if category:
        activities_query = activities_query.filter_by(category=category)
    
    if max_cost:
        activities_query = activities_query.filter(Activity.avg_cost <= float(max_cost))
    
    activities = activities_query.limit(50).all()
    
    return jsonify([activity.to_dict() for activity in activities])

# ========== BUDGET & CALENDAR ROUTES ==========
@app.route('/api/trips/<int:trip_id>/budget', methods=['GET'])
@jwt_required()
def get_trip_budget(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first_or_404()
    
    # Calculate budget breakdown
    accommodation_total = sum(stop.accommodation_budget or 0 for stop in trip.stops)
    transport_total = sum(stop.transport_budget or 0 for stop in trip.stops)
    
    activity_total = 0
    for stop in trip.stops:
        for activity in stop.activities:
            activity_total += activity.actual_cost or 0
    
    total_budget = accommodation_total + transport_total + activity_total
    days = (trip.end_date - trip.start_date).days + 1
    avg_per_day = total_budget / days if days > 0 else 0
    
    budget_data = {
        'total_budget': total_budget,
        'accommodation': accommodation_total,
        'transport': transport_total,
        'activities': activity_total,
        'avg_per_day': avg_per_day,
        'trip_days': days,
        'breakdown_by_day': []
    }
    
    # Calculate breakdown by day
    current_date = trip.start_date
    while current_date <= trip.end_date:
        day_budget = 0
        
        for stop in trip.stops:
            if stop.arrival_date <= current_date <= stop.departure_date:
                # Accommodation for this day
                day_budget += (stop.accommodation_budget or 0) / ((stop.departure_date - stop.arrival_date).days + 1)
                
                # Activities for this day
                for activity in stop.activities:
                    if activity.scheduled_date == current_date:
                        day_budget += activity.actual_cost or 0
        
        budget_data['breakdown_by_day'].append({
            'date': current_date.isoformat(),
            'budget': day_budget
        })
        
        current_date += timedelta(days=1)
    
    return jsonify(budget_data)

@app.route('/api/trips/<int:trip_id>/calendar', methods=['GET'])
@jwt_required()
def get_trip_calendar(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first_or_404()
    
    calendar_data = []
    
    for stop in trip.stops:
        stop_days = []
        current_date = stop.arrival_date
        
        while current_date <= stop.departure_date:
            day_activities = []
            for activity in stop.activities:
                if activity.scheduled_date == current_date:
                    day_activities.append(activity.to_dict())
            
            stop_days.append({
                'date': current_date.isoformat(),
                'activities': day_activities
            })
            current_date += timedelta(days=1)
        
        calendar_data.append({
            'city': stop.city.to_dict() if stop.city else None,
            'days': stop_days
        })
    
    return jsonify(calendar_data)

# ========== SHARING ROUTES ==========
@app.route('/api/trips/<int:trip_id>/share', methods=['POST'])
@jwt_required()
def share_trip(trip_id):
    user_id = get_jwt_identity()
    trip = Trip.query.filter_by(id=trip_id, user_id=user_id).first_or_404()
    
    # Check if share already exists
    existing_share = SharedTrip.query.filter_by(trip_id=trip_id).first()
    if existing_share:
        return jsonify(existing_share.to_dict())
    
    # Create new share
    share = SharedTrip(
        trip_id=trip_id,
        expiry_date=datetime.utcnow().date() + timedelta(days=30)  # Expire in 30 days
    )
    
    db.session.add(share)
    db.session.commit()
    
    return jsonify(share.to_dict()), 201

@app.route('/api/shared/<share_code>', methods=['GET'])
def get_shared_trip(share_code):
    share = SharedTrip.query.filter_by(share_code=share_code).first_or_404()
    
    if share.expiry_date and share.expiry_date < datetime.utcnow().date():
        return jsonify({'error': 'Shared link has expired'}), 410
    
    trip = share.trip
    trip_data = trip.to_dict()
    trip_data['stops'] = [stop.to_dict() for stop in trip.stops]
    
    return jsonify(trip_data)

# ========== USER PROFILE ROUTES ==========
@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    profile_data = user.to_dict()
    profile_data['preferences'] = user.preferences.to_dict() if user.preferences else {}
    
    return jsonify(profile_data)

@app.route('/api/user/profile', methods=['PUT'])
@jwt_required()
def update_user_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    data = request.get_json()
    
    if 'name' in data:
        user.name = data['name']
    if 'profile_photo' in data:
        user.profile_photo = data['profile_photo']
    
    if 'preferences' in data:
        preferences = data['preferences']
        if not user.preferences:
            user.preferences = UserPreferences(user_id=user_id)
        
        if 'language' in preferences:
            user.preferences.language = preferences['language']
        if 'currency' in preferences:
            user.preferences.currency = preferences['currency']
        if 'notifications_enabled' in preferences:
            user.preferences.notifications_enabled = preferences['notifications_enabled']
    
    db.session.commit()
    
    profile_data = user.to_dict()
    profile_data['preferences'] = user.preferences.to_dict() if user.preferences else {}
    
    return jsonify(profile_data)

@app.route('/', methods=['GET'])
def index():
    return jsonify({'status': 'ok', 'message': 'Globetrotter API running'}), 200

@app.route('/favicon.ico')
def favicon():
    return '', 204

if __name__ == '__main__':
    app.run(debug=True, port=5000)

# seed_data.py
from datetime import datetime

def seed_data():
    with app.app_context():  # 'app' is defined above in this file
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        # Add sample cities
        cities_data = [
            {
                'name': 'Paris',
                'country': 'France',
                'country_code': 'FR',
                'cost_index': 85.5,
                'popularity': 95,
                'description': 'City of Light, famous for Eiffel Tower and Louvre',
                'latitude': 48.8566,
                'longitude': 2.3522
            },
            {
                'name': 'Tokyo',
                'country': 'Japan',
                'country_code': 'JP',
                'cost_index': 92.3,
                'popularity': 90,
                'description': 'Vibrant metropolis blending tradition and modernity',
                'latitude': 35.6762,
                'longitude': 139.6503
            },
            {
                'name': 'New York',
                'country': 'USA',
                'country_code': 'US',
                'cost_index': 100.0,
                'popularity': 98,
                'description': 'The city that never sleeps',
                'latitude': 40.7128,
                'longitude': -74.0060
            },
            {
                'name': 'Bangkok',
                'country': 'Thailand',
                'country_code': 'TH',
                'cost_index': 45.2,
                'popularity': 88,
                'description': 'Cultural capital with amazing street food',
                'latitude': 13.7563,
                'longitude': 100.5018
            },
            {
                'name': 'Sydney',
                'country': 'Australia',
                'country_code': 'AU',
                'cost_index': 78.9,
                'popularity': 85,
                'description': 'Harbor city with iconic Opera House',
                'latitude': -33.8688,
                'longitude': 151.2093
            }
        ]
        
        cities = []
        for city_data in cities_data:
            city = City(**city_data)
            cities.append(city)
            db.session.add(city)
        
        db.session.commit()
        
        # Add sample activities
        activities_data = [
            # Paris activities
            {
                'name': 'Eiffel Tower Visit',
                'description': 'Visit the iconic Eiffel Tower and enjoy panoramic views',
                'category': 'Sightseeing',
                'avg_cost': 25.0,
                'duration_hours': 2.5,
                'city_id': 1,
                'latitude': 48.8584,
                'longitude': 2.2945
            },
            {
                'name': 'Louvre Museum Tour',
                'description': 'Explore world-famous art including Mona Lisa',
                'category': 'Culture',
                'avg_cost': 17.0,
                'duration_hours': 4.0,
                'city_id': 1,
                'latitude': 48.8606,
                'longitude': 2.3376
            },
            {
                'name': 'Seine River Cruise',
                'description': 'Evening cruise along the Seine River',
                'category': 'Leisure',
                'avg_cost': 35.0,
                'duration_hours': 1.5,
                'city_id': 1,
                'latitude': 48.8566,
                'longitude': 2.3522
            },
            
            # Tokyo activities
            {
                'name': 'Senso-ji Temple',
                'description': 'Visit Tokyo\'s oldest temple in Asakusa',
                'category': 'Culture',
                'avg_cost': 0.0,
                'duration_hours': 2.0,
                'city_id': 2,
                'latitude': 35.7148,
                'longitude': 139.7967
            },
            {
                'name': 'Shibuya Crossing',
                'description': 'Experience the famous scramble crossing',
                'category': 'Sightseeing',
                'avg_cost': 0.0,
                'duration_hours': 1.0,
                'city_id': 2,
                'latitude': 35.6595,
                'longitude': 139.7004
            },
            {
                'name': 'Tsukiji Fish Market',
                'description': 'Fresh sushi breakfast at famous fish market',
                'category': 'Food',
                'avg_cost': 30.0,
                'duration_hours': 3.0,
                'city_id': 2,
                'latitude': 35.6654,
                'longitude': 139.7704
            }
        ]
        
        for activity_data in activities_data:
            activity = Activity(**activity_data)
            db.session.add(activity)
        
        db.session.commit()
        
        print("Database seeded successfully!")
        print(f"Added {len(cities)} cities and {len(activities_data)} activities")

if __name__ == '__main__':
    seed_data()
import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-123'
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-456'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
    
    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'sqlite:///globetrotter.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Upload configuration
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size
    UPLOAD_FOLDER = 'uploads'
    
    @staticmethod
    def init_app(app):
        pass

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}



