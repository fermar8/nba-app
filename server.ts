import app from './app';

app.listen(process.env.PORT || 4000, () => {
    console.log(`Server started on ${process.env.PORT}`)
});