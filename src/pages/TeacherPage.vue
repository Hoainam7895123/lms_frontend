<template>
    <div class="page-wrapper">
        <div class="container-xl">
            <!-- Tiêu đề trang -->
            <div class="page-header d-print-none my-3">
                <div class="row align-items-center">
                    <div class="col">
                        <h2 class="page-title">Quản lý người dùng</h2>
                        <div class="text-muted mt-1">
                            Quản lý tất cả giáo viên của khoá học
                            <strong>{{ course.name }} </strong>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bộ lọc -->
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row g-3">
                        <!-- Tìm kiếm theo tên hoặc email -->
                        <div class="col-md-4">
                            <label class="form-label">Tìm kiếm theo tên hoặc email</label>
                            <input
                                v-model="filters.search"
                                type="text"
                                class="form-control"
                                placeholder="Nhập tên hoặc email"
                                @input="debouncedFetchUsers"
                            />
                        </div>
                        <div class="col-md-4">
                            <label class="form-label">Trạng thái</label>
                            <select
                                v-model="filters.active"
                                class="form-select"
                                @change="fetchUsers"
                            >
                                <option value="">Tất cả</option>
                                <option value="1">Kích hoạt</option>
                                <option value="0">Không kích hoạt</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Bảng danh sách người dùng -->
            <div class="card">
                <div class="card-body">
                    <!-- Trạng thái đang tải -->
                    <div v-if="loading" class="text-center">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Đang tải...</span>
                        </div>
                    </div>

                    <!-- Bảng -->
                    <div v-else class="table-responsive">
                        <table class="table table-vcenter card-table">
                            <thead>
                                <tr>
                                    <th>Tên</th>
                                    <th>Tên đăng nhập</th>
                                    <th>Email</th>
                                    <th>Vai trò</th>
                                    <th>Trạng thái</th>
                                    <th>Lần đăng nhập cuối</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Trạng thái trống -->
                                <tr v-if="!users">
                                    <td colspan="6" class="text-center text-muted">
                                        Không tìm thấy người dùng.
                                    </td>
                                </tr>
                                <!-- Dòng người dùng -->
                                <tr v-for="user in users" :key="user._id">
                                    <td>{{ user.name || 'N/A' }}</td>
                                    <td>{{ user.username || 'N/A' }}</td>
                                    <td>{{ user.email || 'N/A' }}</td>
                                    <td>{{ formatRole(user.role) }}</td>
                                    <td>
                                        <span
                                            :class="[
                                                'badge',
                                                user.active === 1 ? 'bg-success' : 'bg-danger',
                                            ]"
                                        >
                                            {{
                                                user.active === 1 ? 'Kích hoạt' : 'Không kích hoạt'
                                            }}
                                        </span>
                                    </td>
                                    <td>
                                        {{
                                            user.last_login
                                                ? formatDate(user.last_login)
                                                : 'Chưa từng'
                                        }}
                                    </td>
                                    <td @click="openDeleteStudentModel(user)">
                                        <IconTrash />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Phân trang -->
                <div class="card-footer d-flex align-items-center">
                    <select
                        v-model="pagination.limit"
                        class="form-select w-auto me-3"
                        @change="fetchUsers"
                    >
                        <option :value="10">10 mỗi trang</option>
                        <option :value="20">20 mỗi trang</option>
                        <option :value="50">50 mỗi trang</option>
                    </select>
                    <ul class="pagination m-0 ms-auto">
                        <li class="page-item" :class="{ disabled: pagination.page === 1 }">
                            <a
                                class="page-link"
                                href="#"
                                @click.prevent="
                                    pagination.page > 1 && changePage(pagination.page - 1)
                                "
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M15 6l-6 6l6 6" />
                                </svg>
                                Trước
                            </a>
                        </li>
                        <li class="page-item">
                            <a class="page-link" href="#">
                                Tiếp
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="icon"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    stroke-width="2"
                                    stroke="currentColor"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M9 6l6 6l-6 6" />
                                </svg>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
    <div
        v-if="showDeleteStudentModal"
        class="modal modal-blur fade show"
        style="display: block"
        tabindex="-1"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Xác nhận xóa</h5>
                    <button
                        type="button"
                        class="btn-close"
                        @click="showDeleteStudentModal = false"
                    ></button>
                </div>
                <div class="modal-body">
                    Bạn có chắc muốn xóa học viên "{{ deletingStudent?.name }}" không?
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary" @click="showDeleteStudentModal = false">
                        Hủy
                    </button>
                    <button class="btn btn-danger" @click="confirmDeleteStudent">Xóa</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// import debounce from "lodash/debounce";
import axios from 'axios';
import { IconTrash } from '@tabler/icons-vue';

export default {
    data() {
        return {
            courseId: '',
            course: '',
            showDeleteStudentModal: false,
            deletingStudent: '',
            users: [],
            total: 0,
            loading: false,
            filters: {
                search: '',
                role: '',
                active: '',
            },
            pagination: {
                page: 1,
                limit: 10,
            },
        };
    },
    components: { IconTrash },
    computed: {
        // totalPages() {
        //   return Math.ceil(this.total / this.pagination.limit);
        // },
    },
    created() {
        this.debouncedFetchUsers = this.debounce(this.fetchUsers, 500);
        this.fetchUsers();
        this.courseId = this.$route.params.courseId;
        console.log('Course Id: ', this.courseId);
    },
    methods: {
        async fetchUsers() {
            this.loading = true;
            try {
                const params = {
                    page: this.pagination.page,
                    limit: this.pagination.limit,
                    search: this.filters.search,
                    role: this.filters.role,
                    active: this.filters.active,
                };

                const response = await axios.get(`/api/courses/${this.courseId}/teachers`, {
                    params,
                });
                console.log('Response: ', this.response);

                if (!response.data.error) {
                    this.users = response.data.data.teachers;
                    this.total = response.data.data.total;
                    this.pagination.page = response.data.data.page;
                    this.pagination.limit = response.data.data.limit;
                } else {
                    this.users = [];
                    this.total = 0;
                }
                console.log('users: ', this.users);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
                this.users = [];
                this.total = 0;
            } finally {
                this.loading = false;
            }
        },
        async fetchCourse() {
            try {
                const response = await axios.get(`/api/courses/${this.courseId}`);
                if (!response.data.error) {
                    this.course = response.data.data;
                }
            } catch (error) {
                console.log('Error');
            }
        },
        openDeleteStudentModel(student) {
            this.showDeleteStudentModal = true;
            this.deletingStudent = student;
        },

        async confirmDeleteStudent() {
            try {
                // const response = await axios.get()
            } catch (error) {
                console.log('Error Delete Student');
            }
        },
        changePage(page) {
            this.pagination.page = page;
            this.fetchUsers();
        },
        formatRole(role) {
            return role
                .replace('ROLE_', '')
                .toLowerCase()
                .replace(/\b\w/g, char => char.toUpperCase());
        },
        formatDate(date) {
            return new Date(date).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        },
        debounce(func, delay) {
            let timeoutId;
            return function (...args) {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                }, delay);
            };
        },
    },
    mounted() {
        this.fetchUsers();
        this.fetchCourse();
    },
};
</script>

<style scoped>
.table-responsive {
    min-height: 200px;
}
</style>
