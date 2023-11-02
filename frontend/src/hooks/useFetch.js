import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useFetch(queryField, queryAttributesStr) {
  // Declaring the essential state variables for data and checking
  // if the request is loading or succeeded
  const [data, setData] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Changing loading and success state to true whenever there's an effect
    setLoading(true);
    setSuccess(false);

    // Extracting data from queryAttributesStr
    const queryAttributes = JSON.parse(queryAttributesStr);

    function CRUDOperations(requestField, inputData){
        if (requestField === 'addCourse'){
            axios.post(`/api/createcourse`, inputData)
            .then(response => {
                console.log(response)
                if (response.status !== 200) {
                    alert("Server Error: Course creation failed.");
                }
                })
                .catch(error => {
                    console.error("Network Error:", error);
                    alert("Network Error: Course creation failed.");
                });
        }
        if (requestField === 'editCourse'){
            axios.put(`/api/updatecourse`, inputData)
            .then(response => {
                if (response.status !== 200) {
                    alert("Server Error: Course updation failed.");
                }
                })
                .catch(error => {
                    console.error("Network Error:", error);
                    alert("Network Error: Course updation failed.");
                });
        }
        
        if (requestField === 'removeCourse'){

            axios.delete(`/api/deletecourse/${inputData.id}`)
            .then(response => {
                console.log(response)
            if (response.status !== 200) {
                alert("Server Error: Course deletion failed.");
            }
            })
            .catch(error => {
                console.error("Network Error:", error);
            });
        }
    }

    // asynchronous function to make API call
    async function fetchData() {
      try {

        if (queryField !== "allCourses"){
            await CRUDOperations(queryField, queryAttributes)
        }
        
        const response = await axios.get('/api/getcourses');

        // Checking if the request was a success
        if (response.status === 200) {
          setSuccess(true);
          setData(response); // Storing response data
        } else {
          const errorMessage = response.data.errorMessage || response.data.statusText;
          throw new Error(`Status Code: ${response.status}\nError Message: ${errorMessage}`);
        }
      } catch (error) {
        console.error(error.message);
        setData({ error: error.message });
        setSuccess(false);
      } finally {
        // Changing loading state to false whenever the API request ends in success or failure
        setLoading(false);
      }
    }

    // Making sure that a null field is not passed
    if (queryField) {
      fetchData();
    } else {
      setLoading(false);
      setSuccess(true);
    }


    // Defining variables that trigger useFetch
  }, [queryField, queryAttributesStr]);

  // Returning useFetch response
  return { data, success, loading };
}