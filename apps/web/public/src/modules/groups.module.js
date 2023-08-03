export const groupsModule = angular.module('groups', [])
.component('groupsList', {
    templateUrl: '/partials/groups/list',
    controller: [
        'Group',
        function(Group) {
            this.groups = Group.query();
        }
    ]
})
.component('groupsEdit', {
    templateUrl: '/partials/groups/edit',
    controller: [
        'Group',
        'NotificationService',
        '$stateParams',
        '$state',
        function(Group, NotificationService, $stateParams, $state) {
            if ($stateParams.id) {
                this.group = Group.get({ id: $stateParams.id });
            } else {
                this.group = new Group();
            }

            this.save = function() {
                this.group.$save(() => {
                    NotificationService.showSuccess('Группа сохранена');
                    $state.go('groups', {}, { reload: true });
                })
            }
        }
    ]
})
.component('groupsView', {
    templateUrl: '/partials/groups/view',
    controller: [
        'Group',
        'Server',
        '$stateParams',
        function(Group, Server, $stateParams) {
            this.servers = Server.groupServers({ group_id: $stateParams.id });
            this.group = Group.get({ id: $stateParams.id });
        }
    ]
})