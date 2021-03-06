import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Box, Grid, Stack, Typography, Paper, Rating, TextField, Button, Divider } from '@mui/material';

const buttonStyle = theme => ({
    mt:2,
    width:"10%",
    [theme.breakpoints.down('sm')]: {
        margin: "auto",
        mt:2,
        width: "100%",
    }
})

function ProductReviews(props) {
    const [reviews, setReviews] = useState([]);
    const [myReview, setMyReview] = useState();
    const [error, setError] = useState("");
    const [reviewError, setReviewError] = useState("");
    const [userReview, setUserReview] = useState({rating:0, review:""});
    const [showReviews, setShowReviews] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        getReviews();
        getUserReview();
    }, []);

    const getReviews = async () => {
        try{
            const res = await axios.get(`/reviews/product/${props.product._id}/reviews`,
                    {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}});
            console.log(res.data)
            if(res.data.length) {
                if(user){
                    for(let i=0; i < res.data.length; i++) {
                        if(res.data[i].user._id != user._id) {
                            setShowReviews(true);
                            break;
                        }
                    }
                }
                else {
                    setShowReviews(true);
                }
            }
            setReviews(res.data);
        }
        catch(err) {
            if (err.response && err.response.data) {
                setError(err.response.data)
            }
        }
    }
    
    const getUserReview = async () => {
        try{
            const userReview = await axios.get(`/reviews/product/${props.product._id}/${user._id}`,
                    {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}});
            setMyReview(userReview.data);
        }
        catch(err) {
            if (err.response && err.response.data) {
                setError(err.response.data)
            }
        }
    }

    const submitReview = async () => {
        try {
            var newReview = { ...userReview, user:user._id, product:props.product._id }
            var res = await axios.post("/reviews/", newReview,
                    {headers: {'Authorization': 'Bearer ' + localStorage.getItem('accessToken')}});
            setMyReview(res.data);
        }
        catch(err) {
            if (err.response && err.response.data) {
                setReviewError(err.response.data);
            }
        }
    }

    return (
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant="h5" sx={{fontWeight:"bold"}}>Reviews</Typography>
                    <Typography component="span" variant="body1" sx={{color:"red"}}>
                        {error}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Stack direction={"row"}>
                        <Rating name="read-only" value={Number(props.product.averageRating)} precision={0.25} readOnly />
                        {props.product.averageRating}/5
                    </Stack>
                    <Typography>{props.product.totalRatings + " reviews"}</Typography>
                </Grid>
                <Grid item xs={12}>
                    { user ? 
                    
                        <>
                            {myReview ?
                            <Stack>
                                <Typography variant="h6" sx={{fontWeight:"bold"}}>Your Rating</Typography>
                                <Rating name="read-only" value={Number(myReview.rating)} readOnly  />
                                { myReview.review && <Paper variant='outlined' sx={{mt:2, mb:2, pl:2, pr:2, pt:1, pb:1}}>{myReview.review}</Paper>}
                                
                            </Stack>
                            :
                            <Stack>
                                <Typography component="span" variant="body1" sx={{color:"red"}}>
                                    {reviewError}
                                </Typography>
                                <Typography variant="h6" sx={{fontWeight:"bold"}}>Write a review</Typography>
                                <Rating 
                                    name="rating" 
                                    value={userReview.rating} 
                                    onChange={(event, newValue) => setUserReview({ ...userReview, rating: newValue })} 
                                />
                                <TextField 
                                    multiline 
                                    rows={4} 
                                    label="Review (optional)" 
                                    sx={{mt: 2}} 
                                    value={userReview.review}
                                    inputProps={{ maxLength: 700 }}
                                    onChange={(event) => setUserReview({ ...userReview, review: event.target.value })}>
                                </TextField>
                                <Button 
                                    variant="contained"
                                    sx={buttonStyle} 
                                    onClick={submitReview}
                                    disabled={userReview.rating > 0 ? false : true}>
                                        Submit
                                </Button>
                            </Stack>
                        }
                        </>
                        :
                        <Link to="/login">Login to write a review</Link>
                    }
                    <Typography variant="h6" sx={{mt:2, fontWeight:"bold"}}>User Reviews</Typography>
                    { showReviews ? 
                        <Stack>
                            <Divider />
                            {reviews.map((review, index) => {
                                if(user ? review.user._id != user._id : true){
                                    return <div>
                                        <Box key={index}>
                                            <Typography variant="h6">{review.user.username}</Typography>
                                            <Rating name={review.user.name} value={Number(review.rating)} readOnly />
                                            <Typography variant="body1" sx={{width:"95%"}}>{review.review}</Typography>
                                        </Box>
                                        <Divider />
                                    </div>}
                            })}
                        </Stack>:
                        <Typography variant="body2">No reviews yet...</Typography>
                        }
                </Grid>
            </Grid>
    )
}

export default ProductReviews;