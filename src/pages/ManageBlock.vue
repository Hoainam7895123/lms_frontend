<style scoped>
/* Style chung cho các section */
.info-section,
.video-section,
.section {
    padding: 1.25rem;
    border: 1px solid #e9ecef;
    border-radius: 10px;
    background-color: #ffffff;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
    height: 100%;
}

/* Style cho thông tin block */
.info-item {
    margin-bottom: 1.25rem;
}

.label {
    display: block;
    font-weight: 600;
    color: #206bc4;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
}

.value {
    color: #1a1a1a;
    word-break: break-word;
    font-size: 1rem;
}

/* Style cho video */
.video-section {
    display: flex;
    justify-content: center;
    align-items: center;
}

.video-player {
    width: 100%;
    max-width: 600px;
    height: 350px;
    border-radius: 10px;
    border: 1px solid #e9ecef;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* Style cho section (homework, slide) */
.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
}

.section-title {
    font-size: 1.1rem;
    font-weight: 600;
    color: #206bc4;
    margin: 0;
}

.btn-sm {
    padding: 0.25rem 0.75rem;
    font-size: 0.85rem;
}

.list-container {
    max-height: 250px;
    overflow-y: auto;
    padding-right: 0.5rem;
}

.list-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    background-color: #f8f9fa;
    border-radius: 6px;
    transition: background-color 0.2s ease, transform 0.1s ease;
}

.list-item:hover {
    background-color: #e9ecef;
    transform: translateY(-2px);
}

.item-number {
    font-weight: 600;
    color: #206bc4;
    margin-right: 0.5rem;
}

.item-content {
    flex: 1;
    color: #1a1a1a;
    text-decoration: none;
    font-size: 0.9rem;
}

.item-content:hover {
    text-decoration: underline;
}

.item-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-icon {
    padding: 0.25rem;
}

.btn-ghost-primary .icon {
    fill: #206bc4;
}

.btn-ghost-danger .icon {
    fill: #d63939;
}

/* Style cho modal */
.modal {
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    border-radius: 10px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modal-header {
    border-bottom: 1px solid #e9ecef;
}

.modal-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1a1a1a;
}

.modal-body {
    padding: 1.5rem;
}

.form-label {
    font-weight: 500;
    color: #1a1a1a;
    margin-bottom: 0.5rem;
}

.form-control {
    border-radius: 6px;
    border: 1px solid #e9ecef;
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
}

.form-control:focus {
    border-color: #206bc4;
    box-shadow: 0 0 0 0.2rem rgba(32, 107, 196, 0.25);
}

.modal-footer {
    border-top: 1px solid #e9ecef;
    padding: 1rem;
}

.btn-secondary {
    background-color: #f1f3f5;
    color: #1a1a1a;
    border: none;
}

.btn-secondary:hover {
    background-color: #e9ecef;
}

.btn-primary {
    background-color: #206bc4;
    border: none;
}

.btn-primary:hover {
    background-color: #1a5aa3;
}

.btn-danger {
    background-color: #d63939;
    border: none;
}

.btn-danger:hover {
    background-color: #b53030;
}

/* Căn giữa thông báo */
.text-muted {
    padding: 1rem;
    font-size: 0.9rem;
    text-align: center;
}

/* Đảm bảo icon SVG hiển thị đúng */
.icon {
    width: 16px;
    height: 16px;
}
</style>
<template>
    <div class="me-4">
        <div class="container-xl my-4">
            <div class="row">
                <!-- Thông tin block (bên trái) -->
                <div class="col-3">
                    <div class="info-section">
                        <div class="info-item">
                            <span class="label">Tên bài học:</span>
                            <span class="value">{{ block.name || 'Không có tên' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Mô tả:</span>
                            <span class="value">{{ block.description || 'Không có mô tả' }}</span>
                        </div>
                        <div class="info-item">
                            <span class="label">Thời hạn</span>
                            <span class="value">{{
                                formatDeadline(block.deadline) || 'Không có'
                            }}</span>
                        </div>
                        <!-- Button sửa block -->
                        <button
                            v-if="user?.role !== 'ROLE_TEACHER'"
                            class="btn btn-primary btn-sm w-100 mt-2"
                            @click="editBlock"
                        >
                            Sửa bài giảng
                        </button>
                    </div>
                </div>

                <!-- Video (giữa) -->
                <div class="col-6">
                    <div class="video-section">
                        <video v-if="isMp4Video" controls class="video-player">
                            <source :src="block.video" type="video/mp4" />
                            Trình duyệt của bạn không hỗ trợ video.
                        </video>
                        <iframe
                            v-else-if="isYouTubeVideo"
                            :src="youTubeEmbedUrl"
                            frameborder="0"
                            allowfullscreen
                            class="video-player"
                        ></iframe>
                        <div v-else class="text-muted text-center">Không có video.</div>
                    </div>
                </div>

                <!-- Homework và Slide (bên phải) -->
                <div class="col-3">
                    <!-- Danh sách homework -->
                    <div class="section">
                        <div class="section-header">
                            <h5 class="section-title">Bài tập</h5>
                            <button class="btn btn-primary btn-sm" @click="addHomework">
                                Thêm bài tập
                            </button>
                        </div>
                        <div v-if="homework && homework.length" class="list-container">
                            <div v-for="(item, index) in homework" :key="index" class="list-item">
                                <span class="item-number">{{ index + 1 }}.</span>
                                <router-link :to="`/dashboard/store/${item._id}`">
                                    <span class="item-content">{{
                                        item.title || item.name || 'Bài tập không có tiêu đề'
                                    }}</span>
                                </router-link>
                                <div class="item-actions">
                                    <button
                                        class="btn btn-icon btn-ghost-primary"
                                        @click="editHomework(index)"
                                    >
                                        <IconEdit />
                                    </button>
                                    <button
                                        class="btn btn-icon btn-ghost-danger"
                                        @click="deleteHomework(index)"
                                    >
                                        <IconTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-muted">Không có bài tập.</div>
                    </div>

                    <!-- Danh sách slide -->
                    <div class="section mt-3">
                        <div class="section-header">
                            <h5 class="section-title">Slide</h5>
                            <button class="btn btn-primary btn-sm" @click="addSlide">
                                Thêm slide
                            </button>
                        </div>
                        <div v-if="slide && slide.length" class="list-container">
                            <div v-for="(item, index) in slide" :key="index" class="list-item">
                                <span class="item-number">{{ index + 1 }}.</span>
                                <a :href="item.url || '#'" target="_blank" class="item-content">
                                    {{ item.title || 'Slide ' + (index + 1) }}
                                </a>
                                <div class="item-actions">
                                    <button
                                        class="btn btn-icon btn-ghost-primary"
                                        @click="editSlide(index)"
                                    >
                                        <IconEdit />
                                    </button>
                                    <button
                                        class="btn btn-icon btn-ghost-danger"
                                        @click="deleteSlide(index)"
                                    >
                                        <IconTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-muted">Không có slide.</div>
                    </div>
                </div>
            </div>

            <!-- Modal sửa block -->
            <div
                v-if="showEditBlockModal"
                class="modal modal-blur fade show"
                style="display: block"
                tabindex="-1"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Sửa bài học</h5>
                            <button
                                type="button"
                                class="btn-close"
                                @click="showEditBlockModal = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Tên bài học</label>
                                <input
                                    v-model="blockForm.name"
                                    type="text"
                                    class="form-control"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mô tả</label>
                                <textarea
                                    v-model="blockForm.description"
                                    class="form-control"
                                    rows="3"
                                ></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Deadline</label>
                                <div class="d-flex gap-2">
                                    <input
                                        v-model="blockForm.deadline"
                                        type="date"
                                        class="form-control"
                                        placeholder="Thời gian hết hạn"
                                    />
                                    <button
                                        class="btn btn-outline-danger"
                                        @click="clearDeadline"
                                        type="button"
                                    >
                                        Huỷ
                                    </button>
                                </div>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Video URL</label>
                                <input
                                    v-model="blockForm.video"
                                    type="text"
                                    class="form-control"
                                    placeholder="Link video (MP4 hoặc YouTube)"
                                />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="showEditBlockModal = false">
                                Hủy
                            </button>
                            <button class="btn btn-primary" @click="saveBlock">Lưu</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal thêm/sửa bài tập -->
            <div
                v-if="showHomeworkModal"
                class="modal modal-blur fade show"
                style="display: block"
                tabindex="-1"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                {{ editingHomework ? 'Sửa bài tập' : 'Thêm bài tập' }}
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                @click="showHomeworkModal = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Tiêu đề</label>
                                <input
                                    v-model="homeworkForm.title"
                                    type="text"
                                    class="form-control"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mô tả</label>
                                <textarea
                                    v-model="homeworkForm.description"
                                    type="text"
                                    class="form-control"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <button @click="openFileDialog">Chọn file</button>
                                <input
                                    type="file"
                                    ref="fileInput"
                                    @change="handleFileChange"
                                    style="display: none"
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Deadline</label>
                                <input
                                    v-model="homeworkForm.deadline"
                                    type="date"
                                    class="form-control"
                                    required
                                />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="showHomeworkModal = false">
                                Hủy
                            </button>
                            <button class="btn btn-primary" @click="saveHomework">Lưu</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal xóa bài tập -->
            <div
                v-if="showDeleteHomeworkModal"
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
                                @click="showDeleteHomeworkModal = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            Bạn có chắc muốn xóa bài tập "{{
                                deletingHomework?.title || 'Không có tiêu đề'
                            }}" không?
                        </div>
                        <div class="modal-footer">
                            <button
                                class="btn btn-secondary"
                                @click="showDeleteHomeworkModal = false"
                            >
                                Hủy
                            </button>
                            <button class="btn btn-danger" @click="confirmDeleteHomework">
                                Xóa
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal thêm/sửa slide -->
            <div
                v-if="showSlideModal"
                class="modal modal-blur fade show"
                style="display: block"
                tabindex="-1"
            >
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">
                                {{ editingSlide ? 'Sửa slide' : 'Thêm slide' }}
                            </h5>
                            <button
                                type="button"
                                class="btn-close"
                                @click="showSlideModal = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            <div class="mb-3">
                                <label class="form-label">Tiêu đề slide</label>
                                <input
                                    v-model="slideForm.title"
                                    type="text"
                                    class="form-control"
                                    required
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Mô tả</label>
                                <input
                                    v-model="slideForm.description"
                                    type="text"
                                    class="form-control"
                                    required
                                    placeholder="Mô tả"
                                />
                            </div>
                            <div class="mb-3">
                                <label class="form-label">File</label>
                                <input
                                    v-model="slideForm.file"
                                    type="text"
                                    class="form-control"
                                    required
                                    placeholder="Link tới slide (PDF, ...)"
                                />
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="showSlideModal = false">
                                Hủy
                            </button>
                            <button class="btn btn-primary" @click="saveSlide">Lưu</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Modal xóa slide -->
            <div
                v-if="showDeleteSlideModal"
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
                                @click="showDeleteSlideModal = false"
                            ></button>
                        </div>
                        <div class="modal-body">
                            Bạn có chắc muốn xóa slide "{{
                                deletingSlide?.title || 'Không có tiêu đề'
                            }}" không?
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="showDeleteSlideModal = false">
                                Hủy
                            </button>
                            <button class="btn btn-danger" @click="confirmDeleteSlide">Xóa</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios';
import { IconTrash, IconEdit } from '@tabler/icons-vue';
import { mapState } from 'vuex';

export default {
    name: 'ManageBlock',
    components: {
        IconTrash,
        IconEdit,
    },
    data() {
        return {
            block: '',
            blockId: null,
            homework: '',
            slide: '',
            // Trạng thái modal
            showEditBlockModal: false,
            showHomeworkModal: false,
            showDeleteHomeworkModal: false,
            showSlideModal: false,
            showDeleteSlideModal: false,
            // Dữ liệu form
            blockForm: { name: '', description: '', video: '', deadline: '' },
            homeworkForm: { title: '', description: '', file: '', deadline: '' },
            slideForm: { title: '', description: '', file: '' },
            // Dữ liệu đang chỉnh sửa/xóa
            editingHomework: null,
            deletingHomework: null,
            editingSlide: null,
            deletingSlide: null,
        };
    },
    computed: {
        ...mapState('account', ['user']),
        isMp4Video() {
            return this.block.video && this.block.video.endsWith('.mp4');
        },
        isYouTubeVideo() {
            return (
                this.block.video &&
                (this.block.video.includes('youtube.com') || this.block.video.includes('youtu.be'))
            );
        },
        youTubeEmbedUrl() {
            if (!this.isYouTubeVideo) return '';
            const videoId =
                new URL(this.block.video).searchParams.get('v') ||
                this.block.video.split('/').pop();
            return `https://www.youtube.com/embed/${videoId}`;
        },
    },
    created() {
        this.blockId = this.$route.params.blockId;
    },
    methods: {
        async getInfoBlock() {
            try {
                const response = await axios.get(`/api/blocks/${this.blockId}`);
                this.block = response.data.data;
                console.log(this.block);
            } catch (error) {
                console.error('Error fetching block info:', error);
            }
        },
        async getHomework() {
            try {
                const response = await axios.get(`/api/blocks/${this.blockId}/homeworks`);
                this.homework = response.data.data;
                console.log('Homework: ', this.homework);
            } catch (error) {
                console.error('Error fetching homework info:', error);
            }
        },
        async getSlide() {
            try {
                const response = await axios.get(`/api/blocks/${this.blockId}/slides`);
                this.slide = response.data.data;
            } catch (error) {
                console.error('Error fetching slide info:', error);
            }
        },
        editBlock() {
            this.blockForm = { ...this.block };
            this.convertDeadline();
            this.showEditBlockModal = true;
        },
        async saveBlock() {
            try {
                console.log('BlockId: ', this.blockId);
                console.log('Block Form: ', this.blockForm);
                await axios.put(`/api/blocks/${this.blockId}`, this.blockForm);
                this.showEditBlockModal = false;
                this.getInfoBlock();
            } catch (error) {
                console.error('Error updating block:', error);
                alert('Không thể cập nhật bài học. Vui lòng thử lại.');
            }
        },
        // Thêm/sửa bài tập
        addHomework() {
            this.editingHomework = null;
            this.homeworkForm = {
                title: '',
                description: '',
                file: '',
                deadline: '',
            };
            this.showHomeworkModal = true;
        },
        editHomework(index) {
            this.editingHomework = this.homework[index];
            this.homeworkForm = {
                title: this.editingHomework.title,
                description: this.editingHomework.description,
                file: this.editingHomework.file,
                deadline: this.editingHomework.deadline,
            };
            this.showHomeworkModal = true;
        },
        async saveHomework() {
            try {
                if (this.editingHomework) {
                    await axios.put(
                        `/api/blocks/${this.blockId}/homeworks/${this.editingHomework._id}`,
                        this.homeworkForm
                    );
                } else {
                    const response = await axios.post(
                        `/api/blocks/${this.blockId}/homeworks`,
                        this.homeworkForm
                    );

                    const homeworkId = response.data.data._id;
                    console.log('data', homeworkId);

                    console.log('This.homework: ', this.homeworkForm.file);

                    if (this.homeworkForm.file) {
                        const formData = new FormData();
                        formData.append('file', this.homeworkForm.file);
                        formData.append('id', homeworkId);
                        formData.append('type', 'homework');

                        await axios.post('/api/upload', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                    }
                }
                this.showHomeworkModal = false;
                this.getHomework();
            } catch (error) {
                console.error('Error saving homework:', error);
                alert('Không thể lưu bài tập. Vui lòng thử lại.');
            }
        },
        // Xóa bài tập
        deleteHomework(index) {
            this.deletingHomework = this.homework[index];
            this.showDeleteHomeworkModal = true;
            console.log(this.homework[index]);
        },
        async confirmDeleteHomework() {
            try {
                await axios.delete(`/api/homeworks/${this.deletingHomework._id}`);
                this.showDeleteHomeworkModal = false;
                this.deletingHomework = null;
                this.getHomework();
            } catch (error) {
                console.error('Error deleting homework:', error);
                alert('Không thể xóa bài tập. Vui lòng thử lại.');
            }
        },
        // Thêm/sửa slide
        addSlide() {
            this.editingSlide = null;
            this.slideForm = { title: '', description: '', file: '' };
            this.showSlideModal = true;
        },
        editSlide(index) {
            this.editingSlide = this.slide[index];
            this.slideForm = {
                title: this.editingSlide.title,
                description: this.editingSlide.description,
                file: this.editingSlide.file,
            };
            this.showSlideModal = true;
        },
        async saveSlide() {
            try {
                if (this.editingSlide) {
                    await axios.put(`/api/slides/${this.editingSlide._id}`, this.slideForm);
                } else {
                    await axios.post(`/api/blocks/${this.blockId}/slides`, this.slideForm);
                }
                this.showSlideModal = false;
                this.getSlide();
            } catch (error) {
                console.error('Error saving slide:', error);
                alert('Không thể lưu slide. Vui lòng thử lại.');
            }
        },
        deleteSlide(index) {
            this.deletingSlide = this.slide[index];
            this.showDeleteSlideModal = true;
        },
        async confirmDeleteSlide() {
            try {
                await axios.delete(`/api/slides/${this.deletingSlide._id}`);
                this.showDeleteSlideModal = false;
                this.deletingSlide = null;
                this.getSlide();
            } catch (error) {
                console.error('Error deleting slide:', error);
                alert('Không thể xóa slide. Vui lòng thử lại.');
            }
        },
        formatDeadline(datetime) {
            if (!datetime) return 'Không có';
            const date = new Date(datetime);

            const vietnamTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);

            const hours = vietnamTime.getHours().toString().padStart(2, '0');
            const minutes = vietnamTime.getMinutes().toString().padStart(2, '0');
            const day = vietnamTime.getDate().toString().padStart(2, '0');
            const month = (vietnamTime.getMonth() + 1).toString().padStart(2, '0');
            const year = vietnamTime.getFullYear();

            return `${hours}:${minutes} ${day}/${month}/${year}`;
        },
        convertDeadline() {
            if (this.blockForm.deadline) {
                const date = new Date(this.blockForm.deadline);
                const yyyy = date.getFullYear();
                const mm = String(date.getMonth() + 1).padStart(2, '0');
                const dd = String(date.getDate()).padStart(2, '0');
                this.blockForm.deadline = `${yyyy}-${mm}-${dd}`;
                console.log('Đã format deadline:', this.blockForm.deadline);
            }
        },
        openFileDialog() {
            this.$refs.fileInput.click(); // Mở hộp thoại chọn file
        },
        handleFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                console.log('Đã chọn file:', file.name);
            }
            this.homeworkForm.file = file;
        },
        clearDeadline() {
            this.blockForm.deadline = null;
        },
    },

    mounted() {
        this.getInfoBlock();

        this.getHomework();
        this.getSlide();
    },
};
</script>
