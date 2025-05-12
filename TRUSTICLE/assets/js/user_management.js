$(document).ready(function () {
    // Filter dropdown toggle
    const $filterBtn = $('#filter-btn');
    const $filterDropdown = $('#filter-dropdown');
 
    if ($filterBtn.length && $filterDropdown.length) {
        $filterBtn.on('click', function () {
            $filterDropdown.toggleClass('show');
        });

        $(document).on('click', function (e) {
            if (!$(e.target).closest('.filter-container').length) {
                $filterDropdown.removeClass('show');
            }
        });

        $('.filter-option').on('click', function () {
            const filterValue = $(this).data('filter');
            filterTable(filterValue);
            $filterBtn.find('span').text($(this).text());
            $filterDropdown.removeClass('show');
        });
    }
 
    function filterTable(filterValue) {
        $('.table-container tbody tr').each(function () {
            const $roleCell = $(this).find('td[data-role]');
            const role = $roleCell.data('role')?.toLowerCase();
            const match = filterValue === 'all' || role === filterValue.toLowerCase();
            $(this).toggle(match);
        });
    }
 
    const $searchInput = $('#search-input');
    if ($searchInput.length) {
        $searchInput.on('keyup', function () {
            const searchTerm = $(this).val().toLowerCase();
            const currentFilter = $('#filter-btn span').text().trim().toLowerCase();
 
            $('.table-container tbody tr').each(function () {
                const text = $(this).text().toLowerCase();
                const role = $(this).find('td[data-role]').data('role')?.toLowerCase() || '';
                const matchesSearch = text.includes(searchTerm);
                const matchesFilter = currentFilter === 'all' || role === currentFilter;
                $(this).toggle(matchesSearch && matchesFilter);
            });
        });
    }
 
    // Add User Modal
    const $userModal = $('#user-modal');
    $('#add-user-btn').on('click', () => $userModal.show());
    $userModal.find('.close').on('click', () => $userModal.hide());
    $(window).on('click', function (e) {
        if (e.target === $userModal[0]) $userModal.hide();
    });
 
    // Edit User Modal
    const $editModal = $('#edit-modal');
    $editModal.find('.close').on('click', () => $editModal.hide());
    $(window).on('click', function (e) {
        if (e.target === $editModal[0]) $editModal.hide();
    });
 
    // Role Change Modal
    const $roleModal = $('#role-modal');
    const $roleUserName = $('#role-user-name');
    const $roleUserId = $('#role-user-id');
    const $roleSelect = $('#role-change');
 
    $('.role-icon').on('click', function () {
        const $row = $(this).closest('tr');
        const userId = $row.find('td:first').text();
        const userName = $row.find('td:nth-child(2)').text();
        const userRole = $row.find('td[data-role]').data('role');

        $roleUserName.text(userName);
        $roleUserId.val(userId);
        $roleSelect.val(userRole);
        $roleModal.show();
    });
 
    $roleModal.find('.close').on('click', () => $roleModal.hide());
    $(window).on('click', function (e) {
        if (e.target === $roleModal[0]) $roleModal.hide();
    });
 
    $('#role-form').on('submit', function (e) {
        e.preventDefault();

        const newRole = $roleSelect.val();
        const userName = $roleUserName.text();
        const userId = $roleUserId.val();
        let updated = false;

        $('.table-container tbody tr').each(function () {
            if ($(this).find('td:first').text() === userId) {
                const $roleCell = $(this).find('td[data-role]');
                const $roleBadge = $roleCell.find('.role-badge');
                
                $roleCell.attr('data-role', newRole);
                $roleBadge
                    .attr('class', `role-badge role-${newRole}`)
                    .text(newRole.charAt(0).toUpperCase() + newRole.slice(1));
                
                alert(`Role for ${userName} changed to ${newRole}`);
                updated = true;
                return false;
            }
        });

        if (!updated) {
            alert('Error: Could not find user in table');
        }

        $roleModal.hide();
    });
 
    $('#user-form').on('submit', function (e) {
        e.preventDefault();

        const firstName = $('#first-name').val();
        const lastName = $('#last-name').val();
        const username = $('#username').val();
        const email = $('#email').val();
        const dob = $('#dob').val();
        const role = $('#role').val();
        const password = $('#password').val();
        const confirmPassword = $('#confirm-password').val();

        if (!firstName || !lastName || !username || !email || !dob || !role || !password || !confirmPassword) {
            alert('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        alert('User added successfully');
        $userModal.hide();
        this.reset();
    });
 
    $('#edit-form').on('submit', function (e) {
        e.preventDefault();

        const userId = $('#edit-user-id').val();
        const firstName = $('#edit-first-name').val();
        const lastName = $('#edit-last-name').val();
        const username = $('#edit-username').val();
        const email = $('#edit-email').val();
        const active = $('#edit-active').val() === '1';

        if (!firstName || !lastName || !username || !email) {
            alert('Please fill in all required fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        $('.table-container tbody tr').each(function () {
            if ($(this).find('td:first').text() === userId) {
                $(this).find('td:nth-child(2)').text(`${firstName} ${lastName}`);
                $(this).find('td:nth-child(3)').text(email);
                $(this).find('td:nth-child(4)').text(username);
                const $activeCell = $(this).find('td:nth-child(7)');
                $activeCell.attr('class', active ? 'active-status' : 'inactive-status').text(active ? 'Active' : 'Inactive');
                alert('User updated successfully');
                return false;
            }
        });

        $editModal.hide();
    });
 
    $('.edit-icon').on('click', function () {
        const $row = $(this).closest('tr');
        const userId = $row.find('td:first').text();
        const userName = $row.find('td:nth-child(2)').text();
        const email = $row.find('td:nth-child(3)').text();
        const username = $row.find('td:nth-child(4)').text();
        const active = $row.find('td:nth-child(7)').hasClass('active-status');

        $('#edit-user-id').val(userId);
        const names = userName.split(' ');
        $('#edit-first-name').val(names[0]);
        $('#edit-last-name').val(names.slice(1).join(' '));
        $('#edit-username').val(username);
        $('#edit-email').val(email);
        $('#edit-active').val(active ? '1' : '0');

        $editModal.show();
    });
 
    $('.delete-icon').on('click', function () {
        const $row = $(this).closest('tr');
        const userName = $row.find('td:nth-child(2)').text();

        if (confirm(`Are you sure you want to delete ${userName}?`)) {
            alert(`User ${userName} deleted successfully`);
            $row.remove();
        }
    });
});