'use strict';

class ProfileCalendar {

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
      contentHeight: 700,
      handleWindowResize: true,
      allDaySlot: false,
      slotDuration: '00:60:00',
      selectHelper: true,
      eventRender: (event, element) => {
        console.log('event', event);
        console.log('element', element);
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

  addSingleEventToCalendar(eventData) {
    console.log('MainCalendar.js addEventToCalendar with: ', eventData);
    $(this.mountPointCalendar).fullCalendar('renderEvent', eventData, true); // stick? = true
  }

  removeEventsFromCalendar(idOrFilter) {
    console.log('MainCalendar.js removeEventsFromCalendar with: ', idOrFilter);
    $(this.mountPointCalendar).fullCalendar('removeEvents', idOrFilter);
  }
}



