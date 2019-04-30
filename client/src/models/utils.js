
export default {

    /*
    * Utility Method to create an Array of newly created container or for get request of all containers
    */
    createArrayOnGetOrCreateContainer : (apiResponse) => {
        let containers = [];
        console.log("From utils line 9 apiResponse: => ", apiResponse);
        console.log("utilsMethodToCreateContainerArray stderr : ", apiResponse.stderr);
        if (apiResponse.stdout !== "") {
            containers = JSON.parse(apiResponse.stdout);
            containers.forEach(element => {
                element.Name = JSON.parse((JSON.stringify(element.Name)).replace('/', ''));
            });
        }
        console.log("Returning containers : ", containers);
        return containers;
    },

    /*
    * Utility Method to create an Array of containers to be deleted or stopped
    */
    createArrayOnDeleteOrStop : (apiResponse) => {
        console.log("From Utils line 23 =>", apiResponse.stdout);
        var temp = [];
        let containers = [];
        if (apiResponse.stdout !== "") {
            temp = apiResponse
                .stdout
                .split('\n');
            containers = temp.filter((item) => item !== "");
        }
        console.log("From utilsMethodToCreateContainersToDelete", containers);
        return containers;
    }

}
