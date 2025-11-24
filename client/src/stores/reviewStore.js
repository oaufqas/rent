import { makeAutoObservable } from 'mobx'
import { reviewService } from '../services/index.js'

class ReviewStore {
    reviews = []
    myReviews = []
    loading = false
    hasMore = true
    page = 1
    limit = 10

    constructor() {
        makeAutoObservable(this)
    }

    setReviews(reviews) {
        this.reviews = reviews
    }

    setMyReviews(reviews) {
        this.myReviews = reviews
    }

    setLoading(loading) {
        this.loading = loading
    }

    setHasMore(hasMore) {
        this.hasMore = hasMore
    }

    setPage(page) {
        this.page = page
    }

    fetchReviews = async (reset = false) => {
        if (reset) {
            this.setPage(1)
            this.setHasMore(true)
        }
        if (!reset && !this.hasMore) return

        this.setLoading(true)
        
        try {
            const response = await reviewService.getReviews()
            
            const newReviews = response.data.reviews || response.data
            if (reset) {
                this.setReviews(newReviews)
            } else {
                this.setReviews([...this.reviews, ...newReviews])
            }

            this.setHasMore(newReviews.length === this.limit)
            this.setPage(this.page + 1)
        } catch (error) {
            console.error('Error fetching reviews:', error)
        } finally {
            this.setLoading(false)
        }
    }

    async loadMoreReviews() {
        await this.fetchReviews(false)
    }

    createReview = async (reviewData) => {
        this.setLoading(true)
        try {
            const response = await reviewService.createReview(reviewData)

            return response.data
        } catch (error) {
            console.error('Error creating review:', error)
            throw error
        } finally {
            this.setLoading(false)
        }
    }

    fetchMyReviews = async () => {
        this.setLoading(true)
        try {
            const response = await reviewService.getMyReviews()
            this.setMyReviews(response.data)
            return response.data
        } catch (error) {
            console.error('Error fetching my reviews:', error)
        } finally {
            this.setLoading(false)
        }
    }
}

export const reviewStore = new ReviewStore()