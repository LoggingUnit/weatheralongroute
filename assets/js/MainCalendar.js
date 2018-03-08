'use strict';

class MainCalendar {

  constructor(mountPointCalendar, popUpShow, setTime) {
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
          setTime(start.format());
          popUpShow('form-route');
        }
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
    });
    $(mountPointCalendar).fullCalendar('option', 'timezone', 'local');
  }

  addSingleEventToCalendar(eventData) {
    console.log('MainCalendar.js addEventToCalendar with: ', eventData);
    $(this.mountPointCalendar).fullCalendar('renderEvent', eventData, true); // stick? = true
    $(this.mountPointCalendar).fullCalendar('changeView', 'month');
  }

  removeEventsFromCalendar(idOrFilter) {
    console.log('MainCalendar.js removeEventsFromCalendar with: ', idOrFilter);
    $(this.mountPointCalendar).fullCalendar( 'removeEvents', idOrFilter);
  }
}



