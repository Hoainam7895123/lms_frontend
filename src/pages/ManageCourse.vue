<template>
    <div class="me-4">
        <SidebarTop text="Quản lý khoá học" />
        <div class="container-xl my-2">
            <div class="d-flex align-items-center mb-3 justify-content-end">
                <button
                    v-if="user?.role !== 'ROLE_TEACHER'"
                    class="btn btn-primary"
                    @click="openEditModal(null)"
                >
                    Thêm khoá học
                </button>
            </div>
            <div v-if="courses.length" class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
                <div v-for="course in courses" :key="course._id" class="col">
                    <div class="card h-100 shadow-sm hover-shadow position-relative">
                        <!-- Three-dot menu -->
                        <div class="position-absolute top-0 end-0 m-2">
                            <button
                                v-if="user?.role !== 'ROLE_TEACHER'"
                                class="btn btn-icon btn-ghost-secondary btn-sm"
                                @click="toggleDropdown(course._id)"
                            >
                                <IconDotsVertical v-if="hasIcons" size="20" />
                                <span v-else>...</span>
                            </button>
                            <div
                                v-if="activeDropdown === course._id"
                                class="dropdown-menu dropdown-menu-end show"
                                style="z-index: 999"
                            >
                                <a
                                    class="dropdown-item"
                                    href="#"
                                    @click.prevent="openEditModal(course)"
                                    >Sửa</a
                                >
                                <a
                                    class="dropdown-item text-danger"
                                    href="#"
                                    @click.prevent="openDeleteModal(course)"
                                    >Xoá</a
                                >
                            </div>
                        </div>
                        <img
                            v-if="course.image"
                            :src="course.image"
                            class="card-img-top"
                            :alt="course.name"
                            style="
                                width: 100%;
                                height: 180px;
                                object-fit: contain;
                                box-sizing: border-box;
                            "
                        />
                        <div
                            v-else
                            class="card-img-top bg-light d-flex align-items-center justify-content-center"
                            style="width: 100%; height: 180px"
                        >
                            <span class="text-muted" style="font-size: 0.85rem">No Image</span>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title text-primary">
                                <router-link :to="`/dashboard/courses/${course._id}/topics`">
                                    {{ course.name }}
                                </router-link>
                            </h5>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <RouterLink
                                    :to="`/dashboard/students/${course._id}`"
                                    class="text-muted"
                                >
                                    <IconUsers v-if="hasIcons" class="me-1" size="16" />
                                    {{ course.students?.length || 0 }} Students
                                </RouterLink>
                                <RouterLink
                                    v-if="user?.role !== 'ROLE_TEACHER'"
                                    :to="`/dashboard/teachers/${course._id}`"
                                    class="text-muted"
                                >
                                    <IconChalkboard v-if="hasIcons" class="me-1" size="16" />
                                    {{ course.teachers?.length || 0 }} Teachers
                                </RouterLink>
                            </div>
                            <div>
                                <span class="badge bg-primary-lt">{{ course.code }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="text-center text-muted">No courses available.</div>

            <!-- Edit/Add Modal -->
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
                                {{ editingCourse ? 'Sửa khoá học' : 'Thêm khoá học' }}
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                @click="showEditModal = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <form @submit.prevent="saveCourse">
                                <div class="mb-3">
                                    <label class="form-label">Tên khoá học</label>
                                    <input
                                        v-model="form.name"
                                        type="text"
                                        class="form-control"
                                        required
                                    />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Code</label>
                                    <input v-model="form.code" type="text" class="form-control" />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Mô tả</label>
                                    <textarea
                                        v-model="form.description"
                                        class="form-control"
                                        rows="4"
                                    ></textarea>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Hình ảnh</label>
                                    <input v-model="form.image" type="url" class="form-control" />
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="showEditModal = false">
                                Huỷ
                            </button>
                            <button class="btn btn-primary" @click="saveCourse">Lưu</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div
                v-if="showDeleteModal"
                class="modal modal-blur fade show"
                style="display: block"
                tabindex="-1"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Xác nhận xoá</h5>
                            <button
                                type="button"
                                class="btn-close"
                                @click="showDeleteModal = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            Bạn có chắc chắn muốn xoá khoá học "{{ deletingCourse?.name }}" không?
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="showDeleteModal = false">
                                Huỷ
                            </button>
                            <button class="btn btn-danger" @click="deleteCourse">Xoá</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { IconUsers, IconChalkboard, IconDotsVertical } from '@tabler/icons-vue';
import SidebarTop from '@/components/SidebarTop.vue';
import axios from 'axios';
import { mapState } from 'vuex';

// import { RouterLink } from 'vue-router';

export default {
    components: {
        SidebarTop,
        IconUsers,
        IconChalkboard,
        IconDotsVertical,
    },
    data() {
        return {
            courses: [],
            showEditModal: false,
            showDeleteModal: false,
            editingCourse: null,
            deletingCourse: null,
            form: {
                name: '',
                description: '',
                image: '',
            },
            hasIcons: true,
            activeDropdown: null,
        };
    },
    computed: {
        ...mapState('account', ['user']),
    },
    methods: {
        toggleDropdown(courseId) {
            this.activeDropdown = this.activeDropdown === courseId ? null : courseId;
        },
        openEditModal(course) {
            this.activeDropdown = null; // Close dropdown
            this.editingCourse = course;
            if (course) {
                this.form = {
                    name: course.name,
                    description: course.description,
                    image: course.image,
                    // Bạn có thể thêm các field khác nếu có
                };
            } else {
                this.form = {
                    name: '',
                    description: '',
                    image: '',
                };
            }
            this.showEditModal = true;
        },
        async saveCourse() {
            if (!this.form.name) {
                alert('Name is required');
                return;
            }
            if (this.editingCourse) {
                console.log('Editing course:', this.editingCourse);
                await axios.put(`/api/courses/${this.editingCourse._id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                    data: {
                        ...this.form,
                    },
                });
            } else {
                console.log('Adding new course:', this.form);
                await axios.post('/api/users/courses', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                    },
                    data: {
                        ...this.form,
                    },
                });
            }
            this.getAllCoureses();
            this.showEditModal = false;
            this.form = {
                name: '',
                code: '',
                description: '',
                image: '',
                teachers: [],
                students: [],
            };
        },
        openDeleteModal(course) {
            this.activeDropdown = null; // Close dropdown
            this.deletingCourse = course;
            this.showDeleteModal = true;
        },
        async deleteCourse() {
            await axios.delete(`/api/courses/${this.deletingCourse._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwt')}`,
                },
            });
            this.getAllCoureses();
            this.showDeleteModal = false;
            this.deletingCourse = null;
        },
        async getAllCoureses() {
            try {
                const jwt = localStorage.getItem('jwt');
                const response = await axios.get('/api/users/courses', {
                    headers: {
                        Authorization: `Bearer ${jwt}`,
                    },
                });

                this.courses = response.data.data;
                console.log('Course:', this.courses);
            } catch (error) {
                console.error('Error fetching courses:', error);
            }
        },
    },
    mounted() {
        this.getAllCoureses();
    },
};
</script>

<style scoped>
.card {
    transition: transform 0.2s, box-shadow 0.2s;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.card-title {
    font-size: 1.1rem;
    font-weight: 600;
}

.card-text {
    font-size: 0.85rem;
    line-height: 1.4;
}

.card-img-top {
    border-top-left-radius: 0.5rem;
    border-top-right-radius: 0.5rem;
    width: 100%;
    background-color: #f8f9fa; /* Light background for consistency */
}

.btn-primary,
.btn-ghost-secondary {
    font-size: 0.85rem;
}

.dropdown-menu {
    min-width: 100px;
    z-index: 1000; /* Ensure dropdown is above other elements */
}

.modal {
    background-color: rgba(0, 0, 0, 0.5); /* Backdrop */
}

/* Đảm bảo badge phù hợp với phong cách Tabler */
.badge {
    font-size: 0.875rem; /* Kích thước chữ nhỏ hơn một chút */
    font-weight: 500; /* Độ đậm vừa phải */
    padding: 0.25rem 0.5rem; /* Khoảng cách bên trong badge */
    border-radius: 4px; /* Bo góc nhẹ */
}

/* Màu sắc badge nhẹ (primary light của Tabler) */
.bg-primary-lt {
    background-color: #e6f0fa; /* Màu xanh nhạt của Tabler */
    color: #206bc4; /* Màu chữ xanh đậm */
}

/* Hiệu ứng hover cho badge (tùy chọn) */
.badge:hover {
    background-color: #d1e4f6; /* Màu nhạt hơn khi hover */
    transition: background-color 0.3s ease;
}

/* Khoảng cách cho badge */
.card-body > div:last-child {
    margin-top: 0.5rem; /* Tạo khoảng cách với phần trên */
}
</style>
