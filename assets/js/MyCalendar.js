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
          popUpShow('modal__form_route');
        }
      },
      editable: true,
      eventLimit: true, // allow "more" link when too many events
    });
    $(mountPointCalendar).fullCalendar('option', 'timezone', 'local');
  }

  // addArrOfEventToCalendar(eventArr) {
  //   console.log('MyCalendar.js addArrOfEventToCalendar with: ', eventArr);
  //   $(this.mountPointCalendar).fullCalendar({events: eventArr});
  //   $(this.mountPointCalendar).fullCalendar( 'rerenderEvents' );
  // }

  addSingleEventToCalendar(eventData) {
    console.log('MyCalendar.js addEventToCalendar with: ', eventData);
    $(this.mountPointCalendar).fullCalendar('renderEvent', eventData, true); // stick? = true
  }

  removeEventsFromCalendar(idOrFilter) {
    console.log('MyCalendar.js removeEventsFromCalendar with: ', idOrFilter);
    $(this.mountPointCalendar).fullCalendar( 'removeEvents', idOrFilter);
  }


}



