<template>
    <div class="me-4">
        <div class="container-xl my-4">
            <div class="d-flex justify-content-between align-items-center mb-4">
                <button
                    v-if="user?.role !== 'ROLE_TEACHER'"
                    class="btn btn-primary"
                    @click="openEditModal(null)"
                >
                    Thêm chủ đề mới
                </button>
                <button
                    v-if="user?.role !== 'ROLE_TEACHER'"
                    class="btn btn-primary"
                    @click="showAddTeacher = true"
                >
                    Thêm giáo viên quảnl ý
                </button>
            </div>
            <div class="row">
                <div class="mb-2">
                    <p class="text-muted">
                        {{ topics.length }} chương • {{ totalLessons }} bài học
                    </p>
                </div>
                <div v-if="topics.length">
                    <div
                        v-for="(topic, index) in topics"
                        :key="topic._id"
                        class="accordion-item border mb-2"
                    >
                        <div
                            class="topic p-3 d-flex align-items-center justify-content-between"
                            :id="'heading' + topic._id"
                        >
                            <div>
                                <button
                                    class="btn-custom"
                                    :class="{ collapsed: !expandedTopics[index] }"
                                    type="button"
                                    @click="toggleAccordion(index)"
                                >
                                    <IconPlus class="me-1 color-orange" :size="20" />
                                </button>
                                <span class="me-2 fw-bold fs-3"
                                    >{{ index + 1 }}. {{ topic.name }}</span
                                >
                            </div>
                            <div v-if="user?.role !== 'ROLE_TEACHER'">
                                <button class="btn-custom" @click="openAddBlockModal(topic)">
                                    <IconBorderLeftPlus />
                                </button>
                                <button class="btn-custom" @click="openEditModal(topic)">
                                    <IconEdit class="icon-edit" />
                                </button>
                                <button class="btn-custom" @click="openDeleteModal(topic)">
                                    <IconTrash class="icon-delete" />
                                </button>
                            </div>
                        </div>
                        <div
                            :id="'collapse' + topic._id"
                            class="accordion-collapse collapse"
                            :class="{ show: expandedTopics[index] }"
                            :aria-labelledby="'heading' + topic._id"
                            data-bs-parent="#topicsAccordion"
                        >
                            <div class="">
                                <div v-if="blocks[topic._id] && blocks[topic._id].length">
                                    <ul class="list-unstyled m-0">
                                        <li
                                            class="d-flex align-items-center py-3 px-4 justify-content-between"
                                            v-for="(block, blockIndex) in blocks[topic._id]"
                                            :key="block._id || blockIndex"
                                        >
                                            <div>
                                                <span class="block-number"
                                                    >{{ blockIndex + 1 }}.</span
                                                >
                                                <router-link :to="`/dashboard/blocks/${block._id}`">
                                                    <span class="block-name">{{ block.name }}</span>
                                                </router-link>
                                            </div>

                                            <div @click="openDeleteBlock(block)">
                                                <IconTrash />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div v-else-if="expandedTopics[index]" class="text-muted">
                                    Không có khối nội dung.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="text-center text-muted">Không có chủ đề nào.</div>
            </div>

            <!-- Tổng quan -->

            <!-- Danh sách topic -->

            <!-- Modal Sửa/Thêm -->
            <div
                v-if="showEditModal"
                class="modal modal-blur fade show"
                style="display: block"
                tabindex="-1"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                {{ editingTopic ? 'Sửa chủ đề' : 'Thêm chủ đề' }}
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                @click="showEditModal = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveTopic">
                                <div class="mb-3">
                                    <label class="form-label">Tên chủ đề</label>
                                    <input
                                        v-model="formTopic.name"
                                        type="text"
                                        class="form-control"
                                        required
                                    />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Khóa học</label>
                                    <select
                                        v-model="formTopic.course_id"
                                        class="form-control"
                                        required
                                    >
                                        <option value="">Chọn khóa học</option>
                                        <option
                                            v-for="course in courses"
                                            :key="course._id"
                                            :value="course._id"
                                        >
                                            {{ course.name }}
                                        </option>
                                    </select>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Mô tả</label>
                                    <textarea
                                        v-model="formTopic.description"
                                        class="form-control"
                                        rows="4"
                                    ></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="showEditModal = false">
                                Hủy
                            </button>
                            <button class="btn btn-primary" @click="saveTopic">Lưu</button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="showAddBlock"
                class="modal modal-blur fade show"
                style="display: block"
                tabindex="-1"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Thêm bài học</h5>
                            <button
                                type="button"
                                class="btn-close"
                                @click="showAddBlock = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveTopic">
                                <div class="mb-3">
                                    <label class="form-label">Tên bài học</label>
                                    <input
                                        v-model="formBlock.name"
                                        type="text"
                                        class="form-control"
                                        required
                                    />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Khóa học</label>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Mô tả</label>
                                    <textarea
                                        v-model="formBlock.description"
                                        class="form-control"
                                        rows="4"
                                    ></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Video</label>
                                    <input
                                        v-model="formBlock.video"
                                        type="text"
                                        class="form-control"
                                        required
                                    />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Dealine</label>
                                    <input
                                        v-model="formBlock.deadline"
                                        type="date"
                                        class="form-control"
                                        required
                                    />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="showAddBlock = false">
                                Hủy
                            </button>
                            <button class="btn btn-primary" @click="addBlock">Lưu</button>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="showAddTeacher"
                class="modal modal-blur fade show modal-add-teacher"
                style="display: block"
                tabindex="-1"
            >
                <div class="add-teacher-modal">
                    <div class="card mb-3">
                        <div class="card-body">
                            <div class="row g-3">
                                <!-- Tìm kiếm theo tên hoặc email -->
                                <div class="col-md-7">
                                    <label class="form-label">Tìm kiếm theo tên hoặc email</label>
                                    <input
                                        v-model="filters.search"
                                        type="text"
                                        class="form-control"
                                        placeholder="Nhập tên hoặc email"
                                        @input="debouncedFetchUsers"
                                    />
                                </div>
                                <!-- Lọc theo trạng thái -->
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
                                <div
                                    class="col-md-1 m-0 d-flex justify-content-end align-items-center"
                                >
                                    <button @click="showAddTeacher = false">X</button>
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
                                                        user.active === 1
                                                            ? 'bg-success'
                                                            : 'bg-danger',
                                                    ]"
                                                >
                                                    {{
                                                        user.active === 1
                                                            ? 'Kích hoạt'
                                                            : 'Không kích hoạt'
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
                                            <td>
                                                <button
                                                    @click="addTeacher(user._id)"
                                                    class="btn btn-primary"
                                                >
                                                    Thêm
                                                </button>
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

            <!-- Modal Xóa -->
            <div
                v-if="showDeleteModal"
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
                                @click="showDeleteModal = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            Bạn có chắc muốn xóa bài giảng "{{ deletingBlock?.name }}" không?
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="showDeleteModal = false">
                                Hủy
                            </button>
                            <button class="btn btn-danger" @click="deleteTopic">Xóa</button>
                        </div>
                    </div>
                </div>
            </div>

            <div
                v-if="showDeleteBlock"
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
                                @click="showDeleteBlock = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            Bạn có chắc muốn xóa chủ đề "{{ deletingBlock?.name }}" không?
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="showDeleteBlock = false">
                                Hủy
                            </button>
                            <button class="btn btn-danger" @click="deleteBlock">Xóa</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { IconPlus, IconEdit, IconTrash, IconBorderLeftPlus } from '@tabler/icons-vue';
import axios from 'axios';
import { mapState } from 'vuex';

export default {
    components: {
        IconPlus,
        IconEdit,
        IconTrash,
        IconBorderLeftPlus,
    },
    data() {
        return {
            courseId: '',
            topics: [],
            showAddBlock: false,
            showEditModal: false,
            showDeleteModal: false,
            showDeleteBlock: false,
            showAddTeacher: false,
            editingTopic: null,
            deletingTopic: null,
            deletingBlock: null,
            formTopic: {
                name: '',
                course_id: '',
                description: '',
            },
            formBlock: {
                name: '',
                description: '',
                video: '',
                deadline: '',
            },
            hasIcons: true,
            activeDropdown: null,
            expandedTopics: [],
            allExpanded: false,
            blocks: {},
            users: [],
            total: 0,
            loading: false,
            filters: {
                search: '',
                active: '',
            },
            pagination: {
                page: 1,
                limit: 10,
            },
        };
    },
    computed: {
        ...mapState('account', ['user']),
        totalLessons() {
            return this.topics.length;
        },
    },
    methods: {
        toggleDropdown(topicId) {
            this.activeDropdown = this.activeDropdown === topicId ? null : topicId;
        },
        toggleAccordion(index) {
            this.expandedTopics[index] = !this.expandedTopics[index];
            if (this.expandedTopics[index]) {
                const topicId = this.topics[index]._id;
                this.fetchBlocks(topicId, index);
            }
        },
        async fetchTopics() {
            try {
                this.courseId = this.$route.params.courseId;
                const response = await axios.get(`/api/courses/${this.courseId}/topics`);
                this.topics = response.data.data;
                this.form.course_id = this.courseId;
                // Create a new array with length = this.topics.length and fill all values with false
                this.expandedTopics = new Array(this.topics.length).fill(false);
                this.blocks = {};
            } catch (error) {
                console.error('Lỗi khi lấy danh sách chủ đề:', error);
                // alert("Không thể tải danh sách chủ đề. Vui lòng thử lại.");
            }
        },
        async fetchBlocks(topicId) {
            if (!this.blocks[topicId]) {
                try {
                    const response = await axios.get(`/api/topics/${topicId}/blocks`);
                    this.blocks[topicId] = response.data.data || [];
                } catch (error) {
                    console.error(`Lỗi khi lấy block cho topic ${topicId}:`, error);
                    alert('Không thể tải danh sách block. Vui lòng thử lại.');
                    this.blocks[topicId] = [];
                }
            }
        },
        openEditModal(topic) {
            this.activeDropdown = null;
            this.editingTopic = topic;
            if (topic) {
                this.formTopic.name = topic.name;
                this.formTopic.description = topic.description;
            } else {
                this.formTopic.name = '';
                this.formTopic.description = '';
            }
            this.showEditModal = true;
        },
        async saveTopic() {
            if (!this.formTopic.name) {
                alert('Tên chủ là bắt buộc');
                return;
            }
            try {
                if (this.editingTopic) {
                    await axios.put(`/api/topics/${this.editingTopic._id}`, this.formTopic);
                } else {
                    await axios.post(`/api/courses/${this.courseId}/topics`, this.formTopic);
                }
                this.showEditModal = false;
                this.form = { name: '', course_id: '', description: '' };
                this.fetchTopics();
            } catch (error) {
                console.error('Lỗi khi lưu chủ đề:', error);
                alert('Không thể lưu chủ đề. Vui lòng thử lại.');
            }
        },
        async addBlock() {
            if (!this.formBlock.name) {
                alert('Tên chủ là bắt buộc');
                return;
            }
            try {
                await axios.post(`/api/topics/${this.editingTopic._id}/blocks`, this.formBlock);
                this.showAddBlock = false;
            } catch (error) {
                console.error('Lỗi khi lưu chủ đề:', error);
                alert('Không thể lưu chủ đề. Vui lòng thử lại.');
            }
        },
        openDeleteModal(topic) {
            this.activeDropdown = null;
            this.deletingTopic = topic;
            this.showDeleteModal = true;
        },

        openDeleteBlock(block) {
            this.deletingBlock = block;
            this.showDeleteBlock = true;
        },
        openAddBlockModal(topic) {
            this.activeDropdown = null;
            this.editingTopic = topic;
            this.showAddBlock = true;
        },
        async deleteTopic() {
            try {
                await axios.delete(`/api/topics/${this.deletingTopic._id}`);
                this.showDeleteModal = false;
                this.deletingTopic = null;
                this.fetchTopics();
            } catch (error) {
                console.error('Lỗi khi xóa chủ đề:', error);
                alert('Không thể xóa chủ đề. Vui lòng thử lại.');
            }
        },
        async deleteBlock() {
            try {
                await axios.delete(`/api/blocks/${this.deletingBlock._id}`);
                this.showDeleteBlock = false;
                this.deletingBlock = null;
                this.fetchBlocks();
            } catch (error) {
                console.error('Lỗi khi xóa chủ đề:', error);
                alert('Không thể xóa chủ đề. Vui lòng thử lại.');
            }
        },
        formatTime(date) {
            return new Date(date).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            });
        },
        //START: ADD TEACHER
        async addTeacher(id) {
            try {
                const response = await axios.post(`/api/courses/${this.courseId}/teachers/${id}`);
                if (response.data.error) {
                    alert('Thêm giáo viên quản lý không thành công ❌!');
                    return;
                }
                alert('Thêm giáo viên quản lý không thành công ✅!');
            } catch (error) {
                console.error('Lỗi khi thêm giáo viên quản lý khoá học:', error);
            }
        },
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

                console.log('params: ', params.search);
                const response = await axios.get(`/api/users/courses/${this.courseId}`, { params });

                console.log('params: ', params);

                if (!response.data.error) {
                    this.users = response.data.data.teachers;
                    this.total = response.data.data.total;
                    this.pagination.page = response.data.data.page;
                    this.pagination.limit = response.data.data.limit;
                } else {
                    this.users = [];
                    this.total = 0;
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách người dùng:', error);
                this.users = [];
                this.total = 0;
            } finally {
                this.loading = false;
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
        //END: ADD TEACHER
    },
    mounted() {
        this.fetchTopics();
    },
    created() {
        this.courseId = this.$route.params.courseId;
        this.debouncedFetchUsers = this.debounce(this.fetchUsers, 500);
        this.fetchUsers();
    },
};
</script>

<style scoped>
.add-teacher-modal {
    max-width: 90%;
    width: 1000px;
    background: #fff;
    margin: auto auto;
    margin-top: 100px;
}
.topic {
    background-color: #fff;
}

.btn-custom {
    border: none;
    background-color: transparent;
}

.accordion-body {
    font-size: 0.9rem;
}

.accordion-item {
    position: relative;
}

.btn-primary,
.btn-ghost-secondary {
    font-size: 0.85rem;
}

.dropdown-menu {
    min-width: 100px;
    z-index: 1000;
}

.modal {
    background-color: rgba(0, 0, 0, 0.5);
}

.text-muted {
    font-size: 0.9rem;
}

.color-orange {
    color: rgb(232, 49, 3);
}

.icon-edit {
    color: #007bff;
}

.icon-delete {
    color: #dc3545;
}

.block-number {
    font-weight: 600;
    color: #206bc4; /* Màu xanh của Tabler */
    margin-right: 0.5rem;
}

.block-name {
    flex: 1; /* Chiếm phần còn lại của hàng */
    color: #1a1a1a;
}

.list-unstyled li {
    background-color: #f8f9fa;
    transition: background-color 0.2s ease, transform 0.1s ease;
    border: 1px solid #e9ecef;
}

.list-unstyled li:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
}
</style>
