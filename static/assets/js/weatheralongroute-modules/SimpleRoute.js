'use strict';
/**
 * OLDEST PART OF CODE, DON`T EVEN TRY TO UNDERSTAND
 * 
 * The google map`s returned route have irregular coordanate points (only on turns, no point on straight route),
 * but we want to have weather forecast between known distance (steps), so we have to calculate points with 
 * known distnances between them and calculated points have to lay between original google maps route points.
 * So it is the main purpose of this class. 
 * Nov 2017
 */

class SimpleRoute {

    /**
     * Constructor creates new SimpleRoute obj
     * @param {Object} dir Google API directions responce
     * @param {number} distPerStep expected distance between step after processing
     * @param {number} timeTripBeginUnix time og trip starts UNIX (in seconds)
     * @return {Object} object with class SimpleRoute
     */
    constructor(dir, distPerStep, timeTripBeginUnix) {
        this.timeTripBeginUnix = timeTripBeginUnix * 1000;
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
           timeStart - start step time in milliseconds since first point of first step (it was 0 ms)
           timeEnd - same but about steps end
           stepDistance - actual step distance of current step
           city - city near the step
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
            city: '',
            movementHeading: ''
        }
    }

    /**
     * A main non-private method of SimpleRoute class. Creates array of _calcStep returns. 
     * @param {none}
     * @return {Object} simplified route with predefined step length.
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
            city: '',
            movementHeading: ''
        }

        //Define a zero element with start coordinates to use as _calcStep stepLast parameter
        zeroStep.coordStepStart = this.originalRoute[0];
        zeroStep.coordStepEnd = this.originalRoute[0];
        zeroStep.timeEnd = this.timeTripBeginUnix;
        this.stepArr[0] = zeroStep;

        let length = this._calcLengthStepArr(this.originalRoute, this.distPerStep);
        //console.log('stepArr[0] length:', length);

        for (let i = 0; i < length; i++) {
            this.stepArr[i + 1] = this._calcStep(this.originalRoute, this.stepArr[i], this.distPerStep);
            totalDistanceOfRoute += this.stepArr[i].stepDistance;
            //console.log(totalDistanceOfRoute);
        }
        this._applyTime(this.stepArr, this.originalRouteLeg.duration.value * 1000, this.originalRouteLeg.distance.value);

        return this.stepArr;
    }

    /**
     * Method to apply time of start and end of simplified steps.
     * @param {Object[]} stepArr array of simplified steps
     * @param {number} timeToRoute time to reach destination according Google
     * @param {number} googleLength length of route according Google
     * @return {nope}
     */

    _applyTime(stepArr, timeToRoute, googleLength) {
        //Calculation of a time consumed by last interval (interval wich is less than full step)
        var speedAverage = (googleLength) / (timeToRoute / 3600); //kilometer per hour
        var length = this.stepArr.length;
        var distanceInKilometers = this.stepArr[length - 1].stepDistance / 1000; //kilometer
        var timeLastStep = (distanceInKilometers / speedAverage) * 3600 * 1000;
        //Calculation of a time consumed by rest steps (full steps with same time)
        var timeEachFullStep = (timeToRoute - timeLastStep) / (length - 2);

        for (var i = 1; i < length; i++) {
            stepArr[i].timeStart = stepArr[i - 1].timeEnd;
            stepArr[i].timeEnd = stepArr[i].timeStart + timeEachFullStep;
        }

        stepArr[length - 1].timeEnd = timeToRoute + this.timeTripBeginUnix;
    }

    /**
     * THIS PART OF CODE CAN CAUSE PAIN
     * 
     * A method to calculate single step with fixed predifined step. Step is taken from SimpleRoute object init.
     * @param {Object[]} origRouteArr arr of objects with LatLng class - route to work with
     * @param {Object} stepLast object with coords of last step
     * @param {number} distStp distance covered by one step of simple route
     * @return {Object} returns single step structure of simplified route with fixed predifined step
     */
    _calcStep(origRouteArr, stepLast, distStp) {
        var libSpher = google.maps.geometry.spherical;
        let stepNew = {};
        for (var key in this.stepProto) {
            stepNew[key] = this.stepProto[key];
        }
        stepNew.stepId = stepLast.stepId + 1;
        stepNew.idStart = stepLast.idEnd;
        stepNew.idEnd = stepNew.idStart;

        stepNew.coordStepStart = stepLast.coordStepEnd;
        stepNew.coordStepEnd = stepNew.coordStepStart;

        let stepDistancePrev = 0;
        while (stepNew.stepDistance <= distStp) {
            stepDistancePrev = stepNew.stepDistance;

            if (stepNew.idEnd === stepNew.idStart) {
                //If it is begginging of new while loop
                stepNew.stepDistance += libSpher.computeDistanceBetween(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd + 1]);
                if (stepNew.stepDistance > distStp) {
                    //If no original poing in step range
                    stepNew.idEnd++;
                    break;
                }
                stepNew.coordStepEnd = origRouteArr[stepNew.idEnd + 1];
                stepNew.idEnd++;
                continue;
            }

            if (!origRouteArr[stepNew.idEnd + 1]) {
                //If last ID in original route do following
                //console.log('Info: last element of original route reached, id: ', stepNew.idEnd);
                stepNew.stepDistance += libSpher.computeDistanceBetween(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd]);
                stepNew.coordStepEnd = origRouteArr[stepNew.idEnd];
                //console.log(stepNew);
                return stepNew;
            }

            //Regular additional iteration
            stepNew.stepDistance += libSpher.computeDistanceBetween(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd + 1]);
            stepNew.coordStepEnd = origRouteArr[stepNew.idEnd + 1];

            stepNew.idEnd++;
        }

        stepNew.idEnd--;
        if (stepNew.idEnd !== stepNew.idStart) {
            //If no original poing in step range
            stepNew.coordStepEnd = origRouteArr[stepNew.idEnd];
        }

        //Make new point to have required step distance since last original point
        var diff = stepNew.stepDistance - distStp;
        var heading = libSpher.computeHeading(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd + 1]);
        if (stepNew.idEnd === stepNew.idStart) {
            //If no original poing in step range
            var newPoint = libSpher.computeOffset(stepNew.coordStepEnd, distStp, heading);
        }
        else {
            //If here was original poing in step range
            var newPoint = libSpher.computeOffset(stepNew.coordStepEnd, (stepNew.stepDistance - stepDistancePrev - diff), heading);
        }
        stepNew.stepDistance = stepDistancePrev + libSpher.computeDistanceBetween(stepNew.coordStepEnd, newPoint);
        stepNew.coordStepEnd = newPoint;
        stepNew.movementHeading = heading;

        //console.log(stepNew);
        return stepNew;
    }

    /**
     * A method to calculate simplified array length according to length of all steps in original route and required length of steps.
     * @param {Object[]} route of objects with LatLng class - route to work with
     * @param {numbet} stp distance covered by one step of simple route
     * @return {number} length of simplified route array 
    **/
    _calcLengthStepArr(route, stp) {
        var libSpher = google.maps.geometry.spherical;
        var distTotal = 0;
        for (var i = 0; i < route.length - 1; i++) {
            distTotal += google.maps.geometry.spherical.computeDistanceBetween(route[i], route[i + 1]);
        }
        //console.log('Dist total: ', distTotal);
        var length = Math.ceil(distTotal / stp);
        return length;
    }
}