'use strict';
/**
 * A class which creates and services calendar window from main page.
 * Allows us to pick date and time of planned route and display events on calendar itself.
 */
class MainCalendar {

  /**
   * Constructor creates new MainCalendar obj and view it on element with #mountPointCalendar
   * @param {string} mountPointCalendar id of <div> element to mount calendar
   * @param {function} popUpShow method emitted as soon as date and time picked
   * @param {function} uiElementSetValue method emitted as soon as date and time picked
   * @return {obj} instance of MainCalendar class
   */
  constructor(mountPointCalendar, popUpShow, uiElementSetValue) {
    this.mountPointCalendar = mountPointCalendar;
    this.calendar = $(mountPointCalendar).fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaWeek,agendaDay'
      },
      navLinks: true, // can click day/week names to navigate views
      selectable: true,
      nowIndicator: true,
      contentHeight: "auto",
      // height: 650,
      // aspectRatio: 0.5,
      allDaySlot: false,
      slotDuration: '00:60:00',
      selectHelper: true,
      select: (start, end, jsEvent, view) => {
        console.log(start);
        if (view.name == 'month') {
          $(mountPointCalendar).fullCalendar('gotoDate', start);
          $(mountPointCalendar).fullCalendar('changeView', 'agendaDay');
        } else {
          console.log(start);
          uiElementSetValue('form-route__time-txt', start.format());
          popUpShow('form-route');
        }
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
    });
    $(mountPointCalendar).fullCalendar('option', 'timezone', 'local');
  }

  /**
   * Method creates single fullcalendar.js event and renders it, then set view of MainCalendar to 'month'
   * @param {obj} eventData standart fullcalendar.js event obj
   * @return {none} 
   */
  addSingleEventToCalendar(eventData) {
    console.log('MainCalendar.js addEventToCalendar with: ', eventData);
    $(this.mountPointCalendar).fullCalendar('renderEvent', eventData, true); // stick? = true
    $(this.mountPointCalendar).fullCalendar('changeView', 'month');
  }

  /**
   * Method creates multiple fullcalendar.js event and renders it
   * @param {obj[]} eventDataArr standart fullcalendar.js event obj
   * @return {none} 
   */
  addMultipleEventsToCalendar(eventDataArr) {
    console.log('MainCalendar.js addEventToCalendar with: ', eventDataArr);
    $(this.mountPointCalendar).fullCalendar('renderEvents', eventDataArr, true); // stick? = true
  }

  /**
   * Method removes events currently applied to instance of MainCalendar according to id or filter
   * @param {string} idOrFilter empty string matches all elements of calendar to remove
   * @return {none} 
   */
  removeEventsFromCalendar(idOrFilter) {
    console.log('MainCalendar.js removeEventsFromCalendar with: ', idOrFilter);
    $(this.mountPointCalendar).fullCalendar('removeEvents', idOrFilter);
  }
}



