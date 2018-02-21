'use strict';

class MyCalendar {

  constructor(mountPointCalendar, popUpShow, setTime) {
    this.mountPointCalendar = mountPointCalendar;
    this.calendar = $(mountPointCalendar).fullCalendar({
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'month,agendaDay'
      },
      defaultDate: '2018-02-12',
      navLinks: true, // can click day/week names to navigate views
      selectable: true,
      selectHelper: true,
      timeZone: 'local',
      dayClick: (date, jsEvent, view) => {
        if (view.name == 'month') {
          $(mountPointCalendar).fullCalendar('changeView', 'agendaDay');
        } else {
          setTime(date);
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
      events: [
        {
          title: 'All Day Event',
          start: '2018-02-01'
        },
        {
          title: 'Long Event',
          start: '2018-02-07',
          end: '2018-02-10'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2018-02-09T16:00:00'
        },
        {
          id: 999,
          title: 'Repeating Event',
          start: '2018-02-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2018-02-11',
          end: '2018-02-13'
        },
        {
          title: 'Meeting',
          start: '2018-02-12T10:30:00',
          end: '2018-02-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2018-02-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2018-02-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2018-02-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2018-02-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2018-02-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2018-02-28'
        }
      ]
    });
  }
}



