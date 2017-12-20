'use strict';
/**
 * A class which providing route simplifying and structure for simple route data storage.
 * dir - this.directions - Google API responce
 * distPerStep - distance covered by one step of simple route
 * @param {dir, distPerStep}
 * @return {obj} object with class SimpleRoute
 */
class SimpleRoute {

    constructor(dir, distPerStep) {
        this.dir = dir;
        this.distPerStep = distPerStep;
                
        this.originalRoute = dir.routes[0].overview_path;
        this.originalRouteLeg = dir.routes[0].legs[0];

        this.stepArr = [];
        /**
         * stepId - ID of current step of simplified route,
           idStart - closest to start of current step point of original route array
           idEnd - last included into current step point of original route array 
           coordStepStart - coordinates of start point of current step
           coordStepEnd - coordinates of end point of current step 
           timeStart: 0,
           timeEnd: 0,
           stepDistance - actual step distance of current step
         */
        this.stepProto = {
            stepId: 0,
            idStart: 0,
            idEnd: 0,
            coordStepStart: 0,
            coordStepEnd: 0,
            timeStart: 0,
            timeEnd: 0,
            stepDistance: 0,
        }
    }

    /**
     * A main non-private method of SimpleRoute class. Creates array of _calcStep returns. 
     * Returns simplified route with predefined step length.
     * @param {none}
     * @return {stepArr}
     */
    simplifyRoute() {
        var totalDistanceOfRoute = 0;

        var zeroStep = {
            stepId: 0,
            idStart: 0,
            idEnd: 0,
            coordStepStart: 0,
            coordStepEnd: 0,
            timeStart: 0,
            timeEnd: 0,
            stepDistance: 0,
        }

        //Define a zero element with start coordinates to use as _calcStep stepLast parameter
        zeroStep.coordStepStart = this.originalRoute[0];
        zeroStep.coordStepEnd = this.originalRoute[0];
        this.stepArr[0] = zeroStep;

        let length = this._calcLengthStepArr(this.originalRoute, this.distPerStep);
        console.log('stepArr[0] length:', length);
       
        for (let i = 0; i < length; i++) {
            this.stepArr[i+1] = this._calcStep(this.originalRoute, this.stepArr[i], this.distPerStep);
            totalDistanceOfRoute += this.stepArr[i].stepDistance;
            console.log(totalDistanceOfRoute);
        }
        return this.stepArr;
    }

    /**
     * A method to calculate single step with fixed predifined step. Step is taken from SimpleRoute object initialization.
     * origRouteArr - any arr of objects with LatLng class - route to work with
     * stepLast - object with last return of _calcStep(, ,) method
     * distStp - distance covered by one step of simple route
     * returns single step structure of simplified route with fixed predifined step
     * @param {origRouteArr, stepLast, distStp}
     * @return {stepNew}
     */
    _calcStep(origRouteArr, stepLast, distStp) {
        var libSpher = google.maps.geometry.spherical;
        let stepNew = {};
        for (var key in this.stepProto) {
            stepNew[key] = this.stepProto[key];
        }
        stepNew.stepId = stepLast.stepId+1;
        stepNew.idStart = stepLast.idEnd;
        stepNew.idEnd = stepNew.idStart;

        stepNew.coordStepStart = stepLast.coordStepEnd;
        stepNew.coordStepEnd = stepNew.coordStepStart;
        
        let stepDistancePrev = 0;
        while (stepNew.stepDistance <= distStp) {
            stepDistancePrev = stepNew.stepDistance;

            if (stepNew.idEnd === stepNew.idStart) {
                //If it is begginging of new while loop
                console.log('Info: beginning of new loop detected');
                stepNew.stepDistance += libSpher.computeDistanceBetween(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd+1]);
                if (stepNew.stepDistance > distStp) {
                    //If no original poing in step range
                    stepNew.idEnd++;
                    break;
                }
                stepNew.coordStepEnd = origRouteArr[stepNew.idEnd+1];
                stepNew.idEnd++;
                continue;
            }

            if (!origRouteArr[stepNew.idEnd+1]) {
                //If last ID in original route do following
                console.log('Info: last element of original route reached, id: ', stepNew.idEnd);
                stepNew.stepDistance += libSpher.computeDistanceBetween(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd]);
                stepNew.coordStepEnd = origRouteArr[stepNew.idEnd];
                console.log(stepNew);
                return stepNew;
            }

            //Regular additional iteration
            stepNew.stepDistance += libSpher.computeDistanceBetween(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd+1]);
            stepNew.coordStepEnd = origRouteArr[stepNew.idEnd+1];

            stepNew.idEnd++;            
        }

        stepNew.idEnd--;
        if (stepNew.idEnd !== stepNew.idStart) {
            //If no original poing in step range
            stepNew.coordStepEnd = origRouteArr[stepNew.idEnd];
        } 
        
        //Make new point to have required step distance since last original point
        var diff = stepNew.stepDistance - distStp;
        var heading = libSpher.computeHeading(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd+1]);
        if (stepNew.idEnd === stepNew.idStart) {
            //If no original poing in step range
            var newPoint = libSpher.computeOffset(stepNew.coordStepEnd, distStp, heading);
        } 
        else {
            //If here was original poing in step range
            var newPoint = libSpher.computeOffset(stepNew.coordStepEnd, (stepNew.stepDistance-stepDistancePrev-diff), heading);
        }
        stepNew.stepDistance = stepDistancePrev + libSpher.computeDistanceBetween(stepNew.coordStepEnd, newPoint);
        stepNew.coordStepEnd = newPoint;
        
        console.log(stepNew);
        return stepNew;
    }

    /**
     * A method to calculate simplified array length according to length of all steps in original route and required length of steps.
     * route - any arr of objects with LatLng class - route to work with
     * stp - distance covered by one step of simple route
     * returns - length of simplified route array 
     * @param {route, stp}
     * @return {length}
    **/
    _calcLengthStepArr(route, stp) {
        var libSpher = google.maps.geometry.spherical;
        var distTotal = 0;
        for (var i = 0; i < route.length-1; i++) {
            distTotal += google.maps.geometry.spherical.computeDistanceBetween(route[i],route[i+1]);
        }
        console.log('Dist total: ', distTotal);
        var length = Math.ceil(distTotal / stp);
        return length;
    }
}