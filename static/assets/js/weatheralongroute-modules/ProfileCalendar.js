'use strict';
/**
 * A class which creates and services calendar window from profile modal page.
 * Allows us see and delete events both from calendar itself and from userAccount by 
 * emitting eventDeleteByCalendarButtonClick
 */
class ProfileCalendar {

  /**
   * Constructor creates new ProfileCalendar obj and view it on element with #mountPointCalendar
   * @param {string} mountPointCalendar id of <div> element to mount calendar
   * @param {function} eventDeleteByCalendarButtonClick method emitted by pressing delete button near event
   * @return {Object} instance of ProfileCalendar class
   */
  constructor(mountPointCalendar, eventDeleteByCalendarButtonClick) {
    this.mountPointCalendar = mountPointCalendar;
    this.calendar = $(mountPointCalendar).fullCalendar({
      header: {
        left: '',
        center: '',
        right: ''
      },
      defaultView: 'listMonth',
      navLinks: false, // can click day/week names to navigate views
      selectable: true,
      nowIndicator: false,
      header: false,
      handleWindowResize: true,
      allDaySlot: false,
      slotDuration: '00:60:00',
      selectHelper: true,
      eventRender: (event, element) => {
        // console.log('event', event);
        // console.log('element', element);
        element.append("<td><button type='button' id='btnDeleteEvent'>X</button></td>");
        element.find("#btnDeleteEvent").click(function () {
          eventDeleteByCalendarButtonClick(event.id);
        });
      },
      eventAfterRender: (event, element, view) => {
        element.prev().append("<td><span>Delete</span></td>");
        $(mountPointCalendar).fullCalendar('option', 'contentHeight', 200);
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
    });
    $(mountPointCalendar).fullCalendar('option', 'timezone', 'local');
  }

  /**
   * Method creates single fullcalendar.js event and renders it
   * @param {Object} eventData standart fullcalendar.js event obj
   * @return {none} 
   */
  addSingleEventToCalendar(eventData) {
    console.log('ProfileCalendar.js addEventToCalendar with: ', eventData);
    $(this.mountPointCalendar).fullCalendar('renderEvent', eventData, true); // stick? = true
  }

  /**
  * Method creates multiple fullcalendar.js event and renders it
  * @param {Object[]} eventDataArr standart fullcalendar.js event obj
  * @return {none} 
  */
  addMultipleEventsToCalendar(eventDataArr) {
    console.log('ProfileCalendar.js addEventToCalendar with: ', eventDataArr);
    $(this.mountPointCalendar).fullCalendar('renderEvents', eventDataArr, true); // stick? = true
  }

  /**
   * Method removes events currently applied to instance of ProfileCalendar according to id or filter
   * @param {string} idOrFilter empty string matches all elements of calendar to remove
   * @return {none} 
   */
  removeEventsFromCalendar(idOrFilter) {
    console.log('ProfileCalendar.js removeEventsFromCalendar with: ', idOrFilter);
    $(this.mountPointCalendar).fullCalendar('removeEvents', idOrFilter);
  }

  /**
   * Method rerenders ProfileCalendar <div> after profile popup windows appears
   * @param {none} 
   * @return {none} 
   */
  rerender() {
    $(this.mountPointCalendar).fullCalendar('render');
    $(this.mountPointCalendar).fullCalendar('option', 'contentHeight', 300);
  }
}



