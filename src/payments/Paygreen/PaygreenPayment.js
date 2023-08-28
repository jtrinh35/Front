export const paygreenCreateBuyer = async(user, axiosInstance) => {
    
    const buyer = await axiosInstance.post('/paygreen/createBuyer', {
        firstName: user.name,
        lastName: "trinh", 
        email: user.email
    })
    return buyer
}


