'use strict';

class ProfileCalendar {

  constructor(mountPointCalendar, popUpShow, setTime) {
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
      // contentHeight: 300,
      // height: 300,
      // aspectRatio: 0.5,
      allDaySlot: false,
      slotDuration: '00:60:00',
      selectHelper: true,
      // select: (start, end, jsEvent, view) => {
      //   console.log(start);
      //   if (view.name == 'month') {
      //     $(mountPointCalendar).fullCalendar('gotoDate', start);
      //     $(mountPointCalendar).fullCalendar('changeView', 'agendaDay');
      //   } else {
      //     console.log(start);
      //     setTime(start.format());
      //     popUpShow('modal__form_route');
      //   }
      // },
      eventClick: function (calEvent, jsEvent, view) {
        console.log('Event: ', calEvent);
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
    console.log('MainCalendar.js addEventToCalendar with: ', eventData);
    $(this.mountPointCalendar).fullCalendar('renderEvent', eventData, true); // stick? = true
  }

  removeEventsFromCalendar(idOrFilter) {
    console.log('MainCalendar.js removeEventsFromCalendar with: ', idOrFilter);
    $(this.mountPointCalendar).fullCalendar('removeEvents', idOrFilter);
  }


}



