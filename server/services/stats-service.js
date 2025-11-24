import db from '../config/models.js'
import ApiError from '../apiErrors/api-error.js'
import { Op } from 'sequelize';


class StatsService {
  async getDashboardStats() {
    const currentMonth = this.getCurrentMonthRange();
    
    const stats = {
      newOrders: await this.getNewOrdersCount(currentMonth),
      newUsers: await this.getNewUsersCount(currentMonth),
      activeRentals: await this.getActiveRentalsCount(),
      totalRevenue: await this.getTotalRevenue(currentMonth),
      

      orderChange: await this.getOrderChangePercent(),
      userChange: await this.getUserChangePercent(),
      rentalChange: await this.getRentalChangePercent(),
      revenueChange: await this.getRevenueChangePercent()
    };
    
    return stats;
  }


  
  async getNewOrdersCount(dateRange) {
    return await db.Order.count({
      where: {
        createdAt: {
          [Op.between]: [dateRange.start, dateRange.end]
        }
      }
    });
  }


  
  async getNewUsersCount(dateRange) {
    return await db.User.count({
      where: {
        createdAt: {
          [Op.between]: [dateRange.start, dateRange.end]
        }
      }
    });
  }


  
  async getActiveRentalsCount() {
    return await db.Account.count({
      where: {
        status: 'rented',
        rentExpiresAt: {
          [Op.gt]: new Date()
        }
      }
    });
  }


  
  async getTotalRevenue(dateRange) {
    const result = await db.Transaction.sum('amount', {
      where: {
        status: 'completed',
        method: {
            [Op.or]: ['crypto', 'bank_transfer']},
        createdAt: {
          [Op.between]: [dateRange.start, dateRange.end]
        }
      }
    });
    
    return result || 0;
  }
  
  async getOrderChangePercent() {
    const currentMonth = this.getCurrentMonthRange();
    const previousMonth = this.getPreviousMonthRange();
    
    const currentOrders = await this.getNewOrdersCount(currentMonth);
    const previousOrders = await this.getNewOrdersCount(previousMonth);
    
    return this.calculateChangePercent(currentOrders, previousOrders);
  }
  
  async getUserChangePercent() {
    const currentMonth = this.getCurrentMonthRange();
    const previousMonth = this.getPreviousMonthRange();
    
    const currentUsers = await this.getNewUsersCount(currentMonth);
    const previousUsers = await this.getNewUsersCount(previousMonth);
    
    return this.calculateChangePercent(currentUsers, previousUsers);
  }
  
  async getRentalChangePercent() {
    const currentActive = await this.getActiveRentalsCount();
    
    // Для активных аренд берем данные на конец предыдущего месяца
    const endOfPreviousMonth = this.getPreviousMonthRange().end;
    const previousActive = await db.Order.count({
      where: {
        status: 'active',
        expiresAt: {
          [Op.gt]: endOfPreviousMonth
        }
      }
    });
    
    return this.calculateChangePercent(currentActive, previousActive);
  }
  
  async getRevenueChangePercent() {
    const currentMonth = this.getCurrentMonthRange();
    const previousMonth = this.getPreviousMonthRange();
    
    const currentRevenue = await this.getTotalRevenue(currentMonth);
    const previousRevenue = await this.getTotalRevenue(previousMonth);
    
    return this.calculateChangePercent(currentRevenue, previousRevenue);
  }
  

  getCurrentMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return { start, end };
  }
  
  getPreviousMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const end = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
    
    return { start, end };
  }
  
  calculateChangePercent(current, previous) {
    if (previous === 0) return current > 0 ? 100 : 0;
    return Number((((current - previous) / previous) * 100).toFixed(1));
  }
}

export default new StatsService()