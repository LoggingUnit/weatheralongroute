'use strict';

class MyCalendar {

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
      selectHelper: true,
      select: (start, end, jsEvent, view) => {
        console.log(start);
        if (view.name == 'month') {
          $(mountPointCalendar).fullCalendar( 'gotoDate', start);
          $(mountPointCalendar).fullCalendar('changeView', 'agendaDay');
        } else {
          console.log(start);
          setTime(start.format());
          popUpShow('modal__form_route');
        }
      },
      // dayClick: this.dayClick,
      // select: function (start, end) {
      //   var title = prompt('Event Title:');
      //   var eventData;
      //   if (title) {
      //     eventData = {
      //       title: title,
      //       start: start,
      //       end: end
      //     };
      //     $(mountPointCalendar).fullCalendar('renderEvent', eventData, true); // stick? = true
      //   }
      //   $(mountPointCalendar).fullCalendar('unselect');
      //   $(mountPointCalendar).fullCalendar('changeView', 'agendaDay');
      // },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
     });
    $(mountPointCalendar ).fullCalendar('option', 'timezone', 'local');
  }

  addEventToCalendar(eventData) {
    console.log('MyCalendar.js addEventToCalendar with: ', eventData);
    $(this.mountPointCalendar).fullCalendar('renderEvent', eventData, true); // stick? = true
  }
}



