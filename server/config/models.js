import sequelize from './database.js'
import { DatabaseError, DataTypes } from 'sequelize'


const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    userName: {type:DataTypes.STRING, defaultValue: 'user'},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING},
    role: {type: DataTypes.ENUM('user', 'admin'), allowNull: false, defaultValue: 'user'},
    twoFactorCode: {type: DataTypes.STRING(6), defaultValue: null},
    twoFactorExpires: {type: DataTypes.DATE, defaultValue: null},
    balance: {type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00},
    status:{type: DataTypes.ENUM('unblocked', 'blocked'), defaultValue: 'unblocked'}
})


const UserToken = sequelize.define('userToken', {
    userId: {type: DataTypes.INTEGER, references: {model: 'users', key: 'id'}},
    refreshToken: {type: DataTypes.STRING(512), allowNull: false}
})


const Transaction = sequelize.define('transaction', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    userId: {type: DataTypes.INTEGER, references: {model: 'users', key: 'id'}},
    type: {type: DataTypes.ENUM('deposit', 'payment'), allowNull: false},
    amount: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    status: {type: DataTypes.ENUM('pending', 'completed', 'cancelled'), defaultValue: 'pending'},
    method: {type: DataTypes.ENUM('balance', 'bank_transfer', 'crypto'), allowNull: false},
    description: {type: DataTypes.STRING, allowNull: true},
    orderId: {type: DataTypes.INTEGER, references: {model: 'orders', key: 'id'}, allowNull: true},
    metadata: {type: DataTypes.JSON, allowNull: true, defaultValue: '{}'},
    check: {type: DataTypes.STRING, allowNull: true},
    adminNotes: {type: DataTypes.STRING, allowNull: true}
})


const Account = sequelize.define('account', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    account_number: {type: DataTypes.INTEGER, unique: true, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.TEXT, allowNull: false},
    characters: {type: DataTypes.STRING, defaultValue: '{"bape":false,"crewUniform":false,"more300mif":false}', allowNull: false},
    price: {type: DataTypes.STRING, defaultValue: '{"3":400,"6":700,"12":1200,"24":2100,"else":180,"night":1000}', allowNull: false},
    status: {type: DataTypes.ENUM('rented', 'free', 'unavailable'), defaultValue: 'unavailable', allowNull: false},
    rentExpiresAt: {type: DataTypes.DATE, allowNull: true},
    img: {type: DataTypes.STRING, allowNull: false},
    video: {type: DataTypes.STRING, allowNull: false}
})


const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    amount: {type: DataTypes.DECIMAL(10, 2), allowNull: false},
    status: {type: DataTypes.ENUM('pending', 'paid', 'verified', 'active', 'completed', 'cancelled'), allowNull: false},
    rentPeriod: {type: DataTypes.INTEGER, allowNull: false}, //hours
    startsAt: {type: DataTypes.DATE, allowNull: true},
    expiresAt: {type: DataTypes.DATE, allowNull: true},
    check: {type: DataTypes.STRING, allowNull: true},
    userId: {type: DataTypes.INTEGER, references: {model: 'users', key: 'id'}},
    accountId: {type: DataTypes.INTEGER, references: {model: 'accounts', key: 'id'}},
    verificationPlatform: {type: DataTypes.STRING, allowNull: false},
    userNameInPlatform: {type: DataTypes.STRING, allowNull: false}, 
    canReview: {type: DataTypes.BOOLEAN, defaultValue: false}, 
    hasReview: {type: DataTypes.BOOLEAN, defaultValue: false},
    canSendMail: {type: DataTypes.BOOLEAN, defaultValue: true},
    paymentMethod: {type: DataTypes.ENUM('balance', 'bank_transfer', 'crypto'), allowNull: false},
    transactionId: {type: DataTypes.INTEGER, references :{model: 'transactions', key: 'id'}}
})


const Review = sequelize.define('review', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    ratingValue: {type: DataTypes.INTEGER, allowNull: false, validate: {min: 1, max: 5}},
    comment: {type: DataTypes.TEXT, allowNull: true},
    status: {type: DataTypes.ENUM('pending', 'approved', 'rejected'), defaultValue: 'pending'},
    orderId: {type: DataTypes.INTEGER, references: {model: 'orders', key: 'id'}, allowNull: false, unique: true},
    accountId: {type: DataTypes.INTEGER, references: {model: 'accounts', key: 'id'}},
    userId: {type: DataTypes.INTEGER, references: {model: 'users', key: 'id'}},

})


const PaymentMethod = sequelize.define('paymentMethod', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    details: {type: DataTypes.STRING, allowNull: false},
    isActive: {type: DataTypes.BOOLEAN, defaultValue: true}
})


User.hasMany(Order, {foreignKey: 'userId'})
Order.belongsTo(User, {foreignKey: 'userId'})

User.hasMany(UserToken, {foreignKey: 'userId'})
UserToken.belongsTo(User, {foreignKey: 'userId'})

User.hasMany(Transaction, {foreignKey: 'userId'})
Transaction.belongsTo(User, {foreignKey: 'userId'})

Transaction.hasOne(Order, {foreignKey: 'transactionId'})
Order.belongsTo(Transaction, {foreignKey: 'transactionId'})

Account.hasMany(Order, {foreignKey: 'accountId'})
Order.belongsTo(Account, {foreignKey: 'accountId'})

User.hasMany(Review, {foreignKey: 'userId'})
Review.belongsTo(User, {foreignKey: 'userId'})

Account.hasMany(Review, {foreignKey: 'accountId'})
Review.belongsTo(Account, {foreignKey: 'accountId'})

Order.hasOne(Review, {foreignKey: 'orderId'})
Review.belongsTo(Order, {foreignKey: 'orderId'})


export default {
    User,
    UserToken,
    Transaction,
    Account, 
    Order,
    Review,
    PaymentMethod
}