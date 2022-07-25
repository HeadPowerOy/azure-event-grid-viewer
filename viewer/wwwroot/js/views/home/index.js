const vm = (() => {
    const data = {
        // 1 = Connecting/connected, 2 = Reconnecting, 3 = Unable to connect
        connectionState: 1, 
        receiveEvents: true,
        eventTypeFilter: '',
        subjectFilter: '',
        // eventId, eventType, subject, eventTime, eventData, expanded
        events: []
    };

    const computed = {
        filteredEvents() {
            return this.events.filter(o =>
                (this.eventTypeFilter === '' || o.eventType.toLowerCase().includes(this.eventTypeFilter.toLowerCase())) &&
                (this.subjectFilter === '' || o.subject.toLowerCase().includes(this.subjectFilter.toLowerCase())));
        },

        areAllExpanded() {
            // Cache filteredEvents so it wont be computed twice
            const filteredEvents = this.filteredEvents;

            return filteredEvents.length > 0 && filteredEvents.every(o => o.expanded);
        }
    };

    const methods = {
        clearEvents() {
            this.events.splice(0, this.events.length);
        },

        expandCollapseAll() {
            const shouldExpand = !this.areAllExpanded;

            this.filteredEvents.forEach(o => o.expanded = shouldExpand);
        }
    };

    return Vue.createApp({
        data: () => data,
        computed,
        methods
    })
        .mount('#app');
})();

function signalRError() {
    vm.connectionState = 3;

    alert('Unable to connect to live link. Please refresh the page.');
}

const connection = new signalR.HubConnectionBuilder()
    .withUrl('/hubs/gridevents')
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build();

connection.onreconnecting(error => vm.connectionState = 2);
connection.onreconnected(connectionId => vm.connectionState = 1);
connection.onclose(() => signalRError())

connection.on('gridupdate', (eventId, eventType, subject, eventTime, eventData) => {
    if (vm.receiveEvents) {
        // Most recent events are shown first
        vm.events.unshift({
            eventId: eventId || '',
            eventType: eventType || '',
            subject: subject || '',
            eventTime,
            eventData: eventData || '',
            expanded: false
        });
    }
});

connection.start()
    .catch(error => signalRError());
