'use strict';
/**
 * A class which providing route simplifying and simple route data storage.
 */
class SimpleRoute {

    constructor(dir, distPerStep) {
        this.dir = dir;
        this.distPerStep = distPerStep;
                
        this.originalRoute = dir.routes[0].overview_path;
        this.originalRouteLeg = dir.routes[0].legs[0];

        this.stepArr = [];
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

    simplifyRoute() {
        var firstStep = {
            stepId: 0,
            idStart: 0,
            idEnd: 0,
            coordStepStart: 0,
            coordStepEnd: 0,
            timeStart: 0,
            timeEnd: 0,
            stepDistance: 0,
        }

        firstStep.coordStepStart = this.originalRoute[0];
        firstStep.coordStepEnd = this.originalRoute[0];

        this.stepArr[0] = firstStep;
        let length = this._calcLengthStepArr(this.originalRouteLeg.distance.value, this.distPerStep);
        console.log('stepArr[0] length:', length);

        for (let i = 1; i <= length; i++) {

        }

        this._calcStep(this.originalRoute, this.stepArr[0], this.distPerStep);
    }

    _calcStep(origRouteArr, stepLast, distStp) {
        var libSpher = google.maps.geometry.spherical;
        let stepNew = {};
        for (var key in this.stepProto) {
            stepNew[key] = this.stepProto[key];
        }
        stepNew.stepId = stepLast.stepId+1;
        stepNew.idStart = stepLast.idEnd;
        stepNew.coordStepStart = stepLast.coordStepEnd;
        stepNew.coordStepEnd = stepNew.coordStepStart;
        
        let stepDistancePrev = 0;
        while (stepNew.stepDistance <= distStp) {
            stepDistancePrev = stepNew.stepDistance;

            if (!origRouteArr[stepNew.idEnd]) {
                //If last ID in original route do following
                stepNew.idEnd--;
                console.log('Info: last element of original route reached, id: ', stepNew.idEnd);
                stepNew.stepDistance += libSpher.computeDistanceBetween(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd]);
                stepNew.coordStepEnd = origRoute[stepNew.idEnd];
                break;
            }

            if (stepNew.idEnd === stepNew.idStart) {
                //If it is begginging of new while loop
                console.log('Info: beginning of new loop detected');
                stepNew.stepDistance += libSpher.computeDistanceBetween(stepNew.coordStepStart, origRouteArr[stepNew.idEnd+1]);
                stepNew.coordStepEnd = origRouteArr[stepNew.idEnd+1];
                stepNew.idEnd++;
                continue;
            }

            //Regular additional iteration
            stepNew.stepDistance += libSpher.computeDistanceBetween(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd+1]);
            stepNew.coordStepEnd = origRouteArr[stepNew.idEnd+1];

            stepNew.idEnd++;            
        }

        stepNew.idEnd--;
        stepNew.coordStepEnd = origRouteArr[stepNew.idEnd];
        //Make new point to have required step distance since last original point

        var diff = stepNew.stepDistance - distStp;
        var heading = libSpher.computeHeading(stepNew.coordStepEnd, origRouteArr[stepNew.idEnd+1]);
        var newPoint = libSpher.computeOffset(stepNew.coordStepEnd, (stepNew.stepDistance-stepDistancePrev-diff), heading);
        stepNew.stepDistance = stepDistancePrev + libSpher.computeDistanceBetween(stepNew.coordStepEnd, newPoint);
        stepNew.coordStepEnd = newPoint;
        
        console.log(stepNew);
        return stepNew;
    }

    _calcLengthStepArr(distTotal, stp) {
        var length = Math.ceil(distTotal / stp);
        return length;
    }

}