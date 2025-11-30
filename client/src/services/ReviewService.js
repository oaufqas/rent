import $api from './Api'

export const reviewService = {
  createReview: (reviewData) => $api.post('/reviews', reviewData),

  getReviews: () => $api.get('/reviews'),

  getMyReviews: () => $api.get('/reviews/my'),
}

export default reviewService