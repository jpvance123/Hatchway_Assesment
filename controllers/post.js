const axios = require('axios');
const _ = require("lodash");


const postAPI = async (req, res) => {
    const tags = req.query.tags
    const sortBy = req.query.sortBy || 'id'                         // Default is id
    const direction = req.query.direction || 'asc'                  // Default is asc
    const sortValues = ['id', 'reads', 'likes', 'popularity'];
    const directionValues = ['desc', 'asc']

    if(sortValues.indexOf(sortBy) === -1 || !directionValues.indexOf(direction) === -1){
        res.status(400).send({
            error: 'sortBy parameter is invalid...',
        });
        return console.log('SortBy parameter is invalid...')
    }

    // Check if multiple tags present. If so handle concurrent API calls with axios library

    if(tags.indexOf(',') !== -1){
        let posts = []
        let tagArray = tags.split(',');

        const concurrentRequests = tagArray.map((tag) => {
            return axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tag}&sortBy=${sortBy}&direction=${direction}`)
        })

        try{
            const result = await Promise.all(concurrentRequests)
            result.map((item) => {
                posts = addNewPosts(posts, item.data.posts);
            });
        } catch(err){
            return res.status(500).json({ error:String(err)})
        }

        if(sortBy){
            if (direction === 'desc') {
                posts = posts.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
            } else {
                posts = posts.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
            }
        }

        return res.status(200).send({ posts: posts})
    } 
        // Only one tag provided by user, therefore can sequential process and no need for duplication testing.
    else{
        axios.get(`https://api.hatchways.io/assessment/blog/posts?tag=${tags}&sortBy=${sortBy}&direction=${direction}`).then(
            request => {
                let data = request.data.posts
                if(sortBy){
                    if (direction === 'desc') {
                        data = data.sort((a, b) => (b[sortBy] > a[sortBy]) ? 1 : -1);
                    } else {
                        data = data.sort((a, b) => (b[sortBy] < a[sortBy]) ? 1 : -1);
                    }
                }
                res.status(200).send(data);
            })
            .catch(error => {
                res.status(400).send({
                    error: 'Tags parameter is required',
                })
                console.log(error)
            })
    }
}

// Function to check if Newpost is already in oldPosts => if yes skip, if no add to oldPosts 
// O(n^2) run time currently. Was trying to set a pointer in both posts arrays and reduce runtime but didn't have enough time  
function addNewPosts(oldPosts, newPosts){
    for(let i = 0; i < newPosts.length; i++){
        doesExist = false;

        for(let j =0; j < newPosts.length; j++){
            if(_.isEqual(oldPosts[j], newPosts[i])){
                doesExist = true
                break
            }
        }
        if(!doesExist){
            oldPosts.push(newPosts[i])
        }
    }
    return oldPosts
}

module.exports = {
    postAPI,
}